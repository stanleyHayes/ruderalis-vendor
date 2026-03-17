import Layout from "../../components/layout/layout";
import {useEffect} from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Grid,
    MenuItem,
    Skeleton,
    TextField,
    Typography
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {getProduct, updateProduct, selectProducts, clearProduct} from "../../redux/features/products/products-slice";
import {getShops, selectShops} from "../../redux/features/shops/shops-slice";
import {useNavigate, useParams} from "react-router";
import {Link} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {
    ArrowBack,
    BusinessRounded,
    DescriptionRounded,
    AttachMoneyRounded,
    ImageRounded,
    LocalFloristRounded,
    CookieRounded,
    BuildRounded,
    InventoryRounded,
    StorefrontRounded,
    ScienceRounded,
    ScaleRounded,
    TagRounded,
    QrCodeRounded,
} from "@mui/icons-material";
import {InputAdornment} from "@mui/material";

const VARIANTS = [
    {label: 'Marijuana', value: 'marijuana', color: '#0D6B3F', bgColor: '#D1FAE5', icon: LocalFloristRounded},
    {label: 'Edible', value: 'edible', color: '#B45309', bgColor: '#FEF3C7', icon: CookieRounded},
    {label: 'Accessory', value: 'accessory', color: '#1D4ED8', bgColor: '#DBEAFE', icon: BuildRounded},
];

const STRAINS = [
    {label: 'Indica', value: 'indica'},
    {label: 'Sativa', value: 'sativa'},
    {label: 'Hybrid', value: 'hybrid'},
    {label: 'CBD', value: 'cbd'},
];

const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required').min(2, 'Name must be at least 2 characters'),
    description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
    variant: Yup.string().required('Variant is required').oneOf(['marijuana', 'edible', 'accessory']),
    strain: Yup.string().when('variant', {
        is: 'marijuana',
        then: (schema) => schema.required('Strain is required').oneOf(['indica', 'sativa', 'hybrid', 'cbd']),
        otherwise: (schema) => schema.notRequired(),
    }),
    thc: Yup.number().when('variant', {
        is: 'marijuana',
        then: (schema) => schema.required('THC percentage is required').min(0, 'THC must be 0 or greater').max(100, 'THC cannot exceed 100'),
        otherwise: (schema) => schema.min(0, 'THC must be 0 or greater').notRequired(),
    }),
    cbd: Yup.number().when('variant', {
        is: 'marijuana',
        then: (schema) => schema.required('CBD percentage is required').min(0, 'CBD must be 0 or greater'),
        otherwise: (schema) => schema.min(0, 'CBD must be 0 or greater').notRequired(),
    }),
    stock: Yup.number().required('Stock is required').integer('Stock must be a whole number').min(0, 'Stock cannot be negative'),
    weight: Yup.string().required('Weight is required'),
    sku: Yup.string().required('SKU is required'),
    image: Yup.string().url('Must be a valid URL').required('Image URL is required'),
    shop: Yup.string().required('Shop is required'),
    tags: Yup.string(),
    flavor: Yup.string().when('variant', {
        is: 'edible',
        then: (schema) => schema.required('Flavor is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    ingredients: Yup.string().when('variant', {
        is: 'edible',
        then: (schema) => schema.required('Ingredients are required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    servings: Yup.number().when('variant', {
        is: 'edible',
        then: (schema) => schema.required('Total servings is required').min(1, 'Must have at least 1 serving'),
        otherwise: (schema) => schema.notRequired(),
    }),
    dietaryInfo: Yup.string(),
    material: Yup.string().when('variant', {
        is: 'accessory',
        then: (schema) => schema.required('Material is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    colorField: Yup.string(),
    dimensions: Yup.string(),
});

const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '4px'
    }
};

const SectionHeader = ({icon: Icon, color, title}) => (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, mb: 2}}>
        <Box sx={{
            width: 32, height: 32, borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: `${color}14`,
        }}>
            <Icon sx={{fontSize: 18, color}} />
        </Box>
        <Typography sx={{color: 'text.primary', fontWeight: 700, fontSize: 16}}>
            {title}
        </Typography>
    </Box>
);

const UpdateProductPage = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {product, loading, error} = useSelector(selectProducts);
    const {shops} = useSelector(selectShops);

    useEffect(() => {
        dispatch(getProduct(id));
        dispatch(getShops());
        return () => {
            dispatch(clearProduct());
        };
    }, [dispatch, id]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: product?.name || '',
            description: product?.description || '',
            price: product?.price?.amount || '',
            variant: product?.variant || '',
            strain: product?.strain || '',
            thc: product?.thc || '',
            cbd: product?.cbd || '',
            stock: product?.stock?.quantity ?? '',
            weight: product?.weight || '',
            sku: product?.sku || '',
            image: product?.image || '',
            shop: product?.shop?._id || product?.shop || '',
            tags: Array.isArray(product?.tags) ? product.tags.join(', ') : (product?.tags || ''),
            // Edible fields
            flavor: product?.metadata?.edible?.flavor || '',
            ingredients: product?.metadata?.edible?.ingredients || '',
            servings: product?.metadata?.edible?.servings || '',
            dietaryInfo: product?.metadata?.edible?.dietaryInfo || '',
            // Accessory fields
            material: product?.metadata?.accessory?.material || '',
            colorField: product?.metadata?.accessory?.color || '',
            dimensions: product?.metadata?.accessory?.dimensions || '',
        },
        validationSchema,
        onSubmit: async (values) => {
            const productData = {
                name: values.name,
                description: values.description,
                image: values.image,
                variant: values.variant,
                weight: values.weight,
                sku: values.sku,
                strain: values.variant === 'marijuana' ? values.strain : '',
                thc: values.variant !== 'accessory' ? parseFloat(values.thc) || 0 : 0,
                cbd: values.variant !== 'accessory' ? parseFloat(values.cbd) || 0 : 0,
                tags: values.tags.split(',').map(t => t.trim()).filter(Boolean),
                price: {amount: parseFloat(values.price), currency: 'GHS'},
                stock: {available: parseInt(values.stock) > 0, quantity: parseInt(values.stock)},
                shop: values.shop,
                metadata: {
                    marijuana: values.variant === 'marijuana' ? {} : undefined,
                    edible: values.variant === 'edible' ? {
                        flavor: values.flavor,
                        ingredients: values.ingredients,
                        servings: parseInt(values.servings),
                        dietaryInfo: values.dietaryInfo,
                    } : undefined,
                    accessory: values.variant === 'accessory' ? {
                        material: values.material,
                        color: values.colorField,
                        dimensions: values.dimensions,
                    } : undefined,
                }
            };
            const result = await dispatch(updateProduct({id, data: productData}));
            if (!result.error) {
                navigate(`/products/${id}`);
            }
        }
    });

    const selectedVariant = formik.values.variant;

    return (
        <Layout>
            <Box sx={{overflow: 'auto', maxHeight: '100vh', py: 3}}>
                <Container maxWidth="md">
                    <Button
                        component={Link}
                        to={`/products/${id}`}
                        startIcon={<ArrowBack sx={{fontSize: 18}} />}
                        sx={{
                            color: 'text.secondary',
                            textTransform: 'none',
                            mb: 2,
                            fontWeight: 500,
                            '&:hover': {color: '#0D6B3F', backgroundColor: 'transparent'}
                        }}>
                        Back to Product
                    </Button>

                    <Typography variant="h4" sx={{color: 'text.primary', fontWeight: 700, mb: 3}}>
                        Update Product
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{borderRadius: '4px', mb: 3}}>{error}</Alert>
                    )}

                    {loading && !product ? (
                        <Box>
                            {[...Array(8)].map((_, i) => (
                                <Skeleton key={i} variant="rectangular" height={56} sx={{borderRadius: '4px', mb: 2}} />
                            ))}
                        </Box>
                    ) : (
                        <Card sx={{borderRadius: '6px', boxShadow: 'none', border: '1px solid', borderColor: 'divider'}}>
                            <CardContent sx={{p: 4}}>
                                <form onSubmit={formik.handleSubmit}>
                                    {/* Basic Information */}
                                    <SectionHeader icon={DescriptionRounded} color="#0D6B3F" title="Basic Information" />
                                    <Grid container spacing={2.5}>
                                        <Grid size={{xs: 12}}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="Product Name"
                                                name="name"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.name && Boolean(formik.errors.name)}
                                                helperText={formik.touched.name && formik.errors.name}
                                                slotProps={{input: {startAdornment: (<InputAdornment position="start"><BusinessRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}
                                                sx={textFieldStyles}
                                            />
                                        </Grid>
                                        <Grid size={{xs: 12}}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="Description"
                                                name="description"
                                                multiline
                                                rows={4}
                                                value={formik.values.description}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.description && Boolean(formik.errors.description)}
                                                helperText={formik.touched.description && formik.errors.description}
                                                sx={textFieldStyles}
                                            />
                                        </Grid>
                                        <Grid size={{xs: 12}}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="Image URL"
                                                name="image"
                                                value={formik.values.image}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.image && Boolean(formik.errors.image)}
                                                helperText={formik.touched.image && formik.errors.image}
                                                slotProps={{input: {startAdornment: (<InputAdornment position="start"><ImageRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}
                                                sx={textFieldStyles}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{my: 3}} />

                                    {/* Product Type */}
                                    <SectionHeader icon={LocalFloristRounded} color="#7C3AED" title="Product Type" />
                                    <Grid container spacing={2}>
                                        {VARIANTS.map((v) => {
                                            const IconComp = v.icon;
                                            const isSelected = selectedVariant === v.value;
                                            return (
                                                <Grid size={{xs: 12, sm: 4}} key={v.value}>
                                                    <Box
                                                        onClick={() => formik.setFieldValue('variant', v.value)}
                                                        sx={{
                                                            p: 2.5,
                                                            borderRadius: '8px',
                                                            border: '2px solid',
                                                            borderColor: isSelected ? v.color : 'divider',
                                                            backgroundColor: isSelected ? v.bgColor : 'transparent',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            textAlign: 'center',
                                                            '&:hover': {
                                                                borderColor: v.color,
                                                                backgroundColor: `${v.bgColor}80`,
                                                            }
                                                        }}
                                                    >
                                                        <Box sx={{
                                                            width: 48, height: 48, borderRadius: '12px', mx: 'auto', mb: 1.5,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            backgroundColor: isSelected ? v.color : `${v.color}20`,
                                                        }}>
                                                            <IconComp sx={{fontSize: 24, color: isSelected ? '#fff' : v.color}} />
                                                        </Box>
                                                        <Typography sx={{fontWeight: 700, fontSize: 14, color: isSelected ? v.color : 'text.primary'}}>
                                                            {v.label}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                    {formik.touched.variant && formik.errors.variant && (
                                        <Typography sx={{color: 'error.main', fontSize: 12, mt: 1, ml: 1.5}}>{formik.errors.variant}</Typography>
                                    )}

                                    {/* Variant Details */}
                                    {selectedVariant && (
                                        <>
                                            <Divider sx={{my: 3}} />
                                            <SectionHeader
                                                icon={selectedVariant === 'marijuana' ? ScienceRounded : selectedVariant === 'edible' ? CookieRounded : BuildRounded}
                                                color={selectedVariant === 'marijuana' ? '#0D6B3F' : selectedVariant === 'edible' ? '#B45309' : '#1D4ED8'}
                                                title={selectedVariant === 'marijuana' ? 'Marijuana Details' : selectedVariant === 'edible' ? 'Edible Details' : 'Accessory Details'}
                                            />
                                            <Grid container spacing={2.5}>
                                                {selectedVariant === 'marijuana' && (
                                                    <>
                                                        <Grid size={{xs: 12, sm: 4}}>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                select
                                                                label="Strain"
                                                                name="strain"
                                                                value={formik.values.strain}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={formik.touched.strain && Boolean(formik.errors.strain)}
                                                                helperText={formik.touched.strain && formik.errors.strain}
                                                                sx={textFieldStyles}
                                                            >
                                                                {STRAINS.map(s => (
                                                                    <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                                                                ))}
                                                            </TextField>
                                                        </Grid>
                                                        <Grid size={{xs: 6, sm: 4}}>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                label="THC %"
                                                                name="thc"
                                                                type="number"
                                                                value={formik.values.thc}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={formik.touched.thc && Boolean(formik.errors.thc)}
                                                                helperText={formik.touched.thc && formik.errors.thc}
                                                                slotProps={{input: {endAdornment: (<InputAdornment position="end">%</InputAdornment>)}}}
                                                                sx={textFieldStyles}
                                                            />
                                                        </Grid>
                                                        <Grid size={{xs: 6, sm: 4}}>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                label="CBD %"
                                                                name="cbd"
                                                                type="number"
                                                                value={formik.values.cbd}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={formik.touched.cbd && Boolean(formik.errors.cbd)}
                                                                helperText={formik.touched.cbd && formik.errors.cbd}
                                                                slotProps={{input: {endAdornment: (<InputAdornment position="end">%</InputAdornment>)}}}
                                                                sx={textFieldStyles}
                                                            />
                                                        </Grid>
                                                    </>
                                                )}
                                                {selectedVariant === 'edible' && (
                                                    <>
                                                        <Grid size={{xs: 6, sm: 4}}>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                label="THC per serving"
                                                                name="thc"
                                                                type="number"
                                                                value={formik.values.thc}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={formik.touched.thc && Boolean(formik.errors.thc)}
                                                                helperText={formik.touched.thc && formik.errors.thc}
                                                                slotProps={{input: {endAdornment: (<InputAdornment position="end">mg</InputAdornment>)}}}
                                                                sx={textFieldStyles}
                                                            />
                                                        </Grid>
                                                        <Grid size={{xs: 6, sm: 4}}>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                label="CBD per serving"
                                                                name="cbd"
                                                                type="number"
                                                                value={formik.values.cbd}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={formik.touched.cbd && Boolean(formik.errors.cbd)}
                                                                helperText={formik.touched.cbd && formik.errors.cbd}
                                                                slotProps={{input: {endAdornment: (<InputAdornment position="end">mg</InputAdornment>)}}}
                                                                sx={textFieldStyles}
                                                            />
                                                        </Grid>
                                                        <Grid size={{xs: 6, sm: 4}}>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                label="Total Servings"
                                                                name="servings"
                                                                type="number"
                                                                value={formik.values.servings}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={formik.touched.servings && Boolean(formik.errors.servings)}
                                                                helperText={formik.touched.servings && formik.errors.servings}
                                                                sx={textFieldStyles}
                                                            />
                                                        </Grid>
                                                        <Grid size={{xs: 12, sm: 6}}>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                label="Flavor"
                                                                name="flavor"
                                                                value={formik.values.flavor}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={formik.touched.flavor && Boolean(formik.errors.flavor)}
                                                                helperText={formik.touched.flavor && formik.errors.flavor}
                                                                sx={textFieldStyles}
                                                            />
                                                        </Grid>
                                                        <Grid size={{xs: 12, sm: 6}}>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                label="Dietary Info"
                                                                name="dietaryInfo"
                                                                placeholder="e.g. Vegan, Gluten-free"
                                                                value={formik.values.dietaryInfo}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={formik.touched.dietaryInfo && Boolean(formik.errors.dietaryInfo)}
                                                                helperText={formik.touched.dietaryInfo && formik.errors.dietaryInfo}
                                                                sx={textFieldStyles}
                                                            />
                                                        </Grid>
                                                        <Grid size={{xs: 12}}>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                label="Ingredients"
                                                                name="ingredients"
                                                                multiline
                                                                rows={3}
                                                                value={formik.values.ingredients}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={formik.touched.ingredients && Boolean(formik.errors.ingredients)}
                                                                helperText={formik.touched.ingredients && formik.errors.ingredients}
                                                                sx={textFieldStyles}
                                                            />
                                                        </Grid>
                                                    </>
                                                )}
                                                {selectedVariant === 'accessory' && (
                                                    <>
                                                        <Grid size={{xs: 12, sm: 4}}>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                label="Material"
                                                                name="material"
                                                                value={formik.values.material}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={formik.touched.material && Boolean(formik.errors.material)}
                                                                helperText={formik.touched.material && formik.errors.material}
                                                                sx={textFieldStyles}
                                                            />
                                                        </Grid>
                                                        <Grid size={{xs: 12, sm: 4}}>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                label="Color"
                                                                name="colorField"
                                                                value={formik.values.colorField}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={formik.touched.colorField && Boolean(formik.errors.colorField)}
                                                                helperText={formik.touched.colorField && formik.errors.colorField}
                                                                sx={textFieldStyles}
                                                            />
                                                        </Grid>
                                                        <Grid size={{xs: 12, sm: 4}}>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                label="Dimensions"
                                                                name="dimensions"
                                                                value={formik.values.dimensions}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={formik.touched.dimensions && Boolean(formik.errors.dimensions)}
                                                                helperText={formik.touched.dimensions && formik.errors.dimensions}
                                                                sx={textFieldStyles}
                                                            />
                                                        </Grid>
                                                    </>
                                                )}
                                            </Grid>
                                        </>
                                    )}

                                    <Divider sx={{my: 3}} />

                                    {/* Pricing & Inventory */}
                                    <SectionHeader icon={InventoryRounded} color="#B45309" title="Pricing & Inventory" />
                                    <Grid container spacing={2.5}>
                                        <Grid size={{xs: 6, sm: 3}}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="Price (GHS)"
                                                name="price"
                                                type="number"
                                                value={formik.values.price}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.price && Boolean(formik.errors.price)}
                                                helperText={formik.touched.price && formik.errors.price}
                                                slotProps={{input: {startAdornment: (<InputAdornment position="start"><AttachMoneyRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}
                                                sx={textFieldStyles}
                                            />
                                        </Grid>
                                        <Grid size={{xs: 6, sm: 3}}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="Stock"
                                                name="stock"
                                                type="number"
                                                value={formik.values.stock}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.stock && Boolean(formik.errors.stock)}
                                                helperText={formik.touched.stock && formik.errors.stock}
                                                sx={textFieldStyles}
                                            />
                                        </Grid>
                                        <Grid size={{xs: 6, sm: 3}}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="Weight"
                                                name="weight"
                                                value={formik.values.weight}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.weight && Boolean(formik.errors.weight)}
                                                helperText={formik.touched.weight && formik.errors.weight}
                                                slotProps={{input: {startAdornment: (<InputAdornment position="start"><ScaleRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}
                                                sx={textFieldStyles}
                                            />
                                        </Grid>
                                        <Grid size={{xs: 6, sm: 3}}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="SKU"
                                                name="sku"
                                                value={formik.values.sku}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.sku && Boolean(formik.errors.sku)}
                                                helperText={formik.touched.sku && formik.errors.sku}
                                                slotProps={{input: {startAdornment: (<InputAdornment position="start"><QrCodeRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}
                                                sx={textFieldStyles}
                                            />
                                        </Grid>
                                        <Grid size={{xs: 12}}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="Tags"
                                                name="tags"
                                                placeholder="e.g. organic, premium, new-arrival"
                                                value={formik.values.tags}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.tags && Boolean(formik.errors.tags)}
                                                helperText={formik.touched.tags ? formik.errors.tags : 'Comma-separated tags'}
                                                slotProps={{input: {startAdornment: (<InputAdornment position="start"><TagRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}
                                                sx={textFieldStyles}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{my: 3}} />

                                    {/* Shop Assignment */}
                                    <SectionHeader icon={StorefrontRounded} color="#1D4ED8" title="Shop Assignment" />
                                    <Grid container spacing={2.5}>
                                        <Grid size={{xs: 12, sm: 6}}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                select
                                                label="Shop"
                                                name="shop"
                                                value={formik.values.shop}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.shop && Boolean(formik.errors.shop)}
                                                helperText={formik.touched.shop && formik.errors.shop}
                                                sx={textFieldStyles}
                                            >
                                                {(shops || []).map(shop => (
                                                    <MenuItem key={shop._id} value={shop._id}>{shop.name}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{my: 3}} />

                                    {/* Actions */}
                                    <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end'}}>
                                        <Button
                                            component={Link}
                                            to={`/products/${id}`}
                                            variant="outlined"
                                            sx={{
                                                borderColor: 'divider',
                                                color: 'text.secondary',
                                                borderRadius: '4px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                px: 4,
                                                '&:hover': {
                                                    borderColor: 'text.secondary',
                                                    backgroundColor: 'transparent'
                                                }
                                            }}>
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={loading}
                                            sx={{
                                                backgroundColor: '#0D6B3F',
                                                borderRadius: '4px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                px: 4,
                                                '&:hover': {backgroundColor: '#0A5832'}
                                            }}>
                                            {loading ? 'Updating...' : 'Update Product'}
                                        </Button>
                                    </Box>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </Container>
            </Box>
        </Layout>
    );
};

export default UpdateProductPage;
