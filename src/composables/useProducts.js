import { ref } from 'vue'
import { supabase } from '../utils/supabase'

const DEFAULT_COMMISSION = 0.20;

const normalizeCommissionValue = (value) => {
  const numeric = parseFloat(value)
  if (Number.isNaN(numeric)) return DEFAULT_COMMISSION
  if (numeric < 0) return 0
  if (numeric > 1) return 1
  return Number(numeric.toFixed(4))
}

export const useProducts = () => {
  const allProducts = ref([])
  const errorType = ref('')
  const errorMessage = ref('')
  const userUuid = ref('') // Começa vazio
  const allCategoriesOfProduct = ref([])
  const templatesOfCategories = ref([])
  const productsByUserUuid = ref([])
  const productById = ref([])
  const nameProduct = ref('')
  const descriptionProduct = ref('')
  const commissionProduct = ref(DEFAULT_COMMISSION)
  const productCheckoutId = ref('')
  const productPlataform = ref('')
  const afiliateId = ref('')
  const afiliateLink = ref('')
  const defaultLink = ref('')
  
  async function fetchAlProducts() {
    let query = supabase
      .from('products')
      .select('*, user:users(name)') 
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    if (userUuid.value) {
        query = query.eq('user_id', userUuid.value)
    }

    const { data: dataAllProducts, error: errorAllProducts } = await query

    if (errorAllProducts) {
      console.error('Erro ao buscar produtos:', errorAllProducts);
      errorType.value = 'error'
      errorMessage.value = 'Erro ao buscar produtos.'
      return [];
    }
    allProducts.value = dataAllProducts || []
    return allProducts.value
  }

  async function fetchCategoriesOfProduct() {
    const { data: dataCategoriesOfProduct, error: errorCategoriesOfProduct} = await supabase.from('knowledge_categories').select('*');
    if (errorCategoriesOfProduct) {
      console.error('Erro ao buscar categorias de produtos:', errorCategoriesOfProduct);
      errorType.value = 'error'
      errorMessage.value = 'Erro ao buscar categorias de produtos.'
      return [];
    }
    return allCategoriesOfProduct.value = dataCategoriesOfProduct
  }

  async function fetchCategoriesTemplate(productCategorieId) {
    const {data: dataCategoriesTemplate, error: errorCategoriesTemplate} = await supabase.from('knowledge_templates').select('*').eq('id_categories', productCategorieId);
    if (errorCategoriesTemplate) {
      console.error('Erro ao buscar templates de categorias:', errorCategoriesTemplate);
      errorType.value = 'error'
      errorMessage.value = 'Erro ao buscar templates de categorias.'
      return [];
    }
    return templatesOfCategories.value = dataCategoriesTemplate
  }

  async function fetchProductsByUserUuid(userId) {
    const {data: dataProductsByUserUuid, error: errorProductsByUserUuid} = await supabase.from('products').select('*').eq('user_id', userId);
    if (errorProductsByUserUuid) {
      console.error('Erro ao buscar produtos por UUID de usuário:', errorProductsByUserUuid);
      errorType.value = 'error'
      errorMessage.value = 'Erro ao buscar produtos por UUID de usuário.'
      return null;
    }
    return productsByUserUuid.value = dataProductsByUserUuid
  }

  async function fetchProductById(productId) {
    const {data: dataProductById, error: errorProductById} = await supabase.from('products').select('*').eq('id', productId).single();
    if (errorProductById) {
      console.error('Erro ao buscar produto por ID:', errorProductById);
      errorType.value = 'error'
      errorMessage.value = 'Erro ao buscar produto por ID.'
      return null;
    }
    return productById.value = dataProductById
  }

  async function createProduct() {
    const {data: dataCreateProduct, error: errorCreateProduct} = await supabase.from('products').insert({
      user_id: userUuid.value,
      name: nameProduct.value,
      description: descriptionProduct.value,
      checkout_id: productCheckoutId.value,
      plataform: productPlataform.value,
      afiliate_id: afiliateId.value,
      afiliate_link: afiliateLink.value,
      default_link: defaultLink.value,
      commission: normalizeCommissionValue(commissionProduct.value)
    }).select().single();
    
    if (errorCreateProduct) {
      console.error('Erro ao criar produto:', errorCreateProduct);
      errorType.value = 'error'
      errorMessage.value = 'Erro ao criar produto.'
      return null;
    }
    return dataCreateProduct
  }

  async function deleteProductById(productId) {
    const { error: errorDeleteProduct } = await supabase
      .from('products')
      .update({deleted_at: new Date().toISOString() })
      .eq('id', productId);
    if (errorDeleteProduct) {
        console.error("Erro ao deletar produto:", errorDeleteProduct);
    }
    return errorDeleteProduct;
  }

  async function editProductById(productId) {
    const { data: dataEditProduct, error: errorEditProduct } = await supabase
      .from('products')
      .update({
        name: nameProduct.value,
        description: descriptionProduct.value,
        checkout_id: productCheckoutId.value,
        plataform: productPlataform.value,
        afiliate_id: afiliateId.value,
        afiliate_link: afiliateLink.value,
        default_link: defaultLink.value,
        commission: normalizeCommissionValue(commissionProduct.value)
      })
      .eq('id', productId)
      .select()
      .single();
    if (errorEditProduct) {
      console.error('Erro ao editar produto:', errorEditProduct);
      errorType.value = 'error'
      errorMessage.value = 'Erro ao editar produto.'
      return null;
    }
    return dataEditProduct
  }

  return {
    allProducts,
    userUuid,
    fetchAlProducts,
    errorType,
    errorMessage,
    allCategoriesOfProduct,
    fetchCategoriesOfProduct,
    templatesOfCategories,
    fetchCategoriesTemplate,
    fetchProductsByUserUuid,
    productsByUserUuid,
    fetchProductById,
    productById,
    nameProduct,
    descriptionProduct,
    createProduct,
    deleteProductById,
    editProductById,
    productCheckoutId,
    productPlataform,
    afiliateId,
    afiliateLink,
    defaultLink,
    commissionProduct
  }
}