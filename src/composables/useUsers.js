import { ref } from 'vue'
import { supabase } from '../utils/supabase'


export const useUSers = () => {
  const allUsers = ref([])
  const errorType = ref('')
  const errorMessage = ref('')
  const userById = ref([])

  async function fetchAllUsers() {
    const { data: dataAllUsers, error: errorAllUsers} = await supabase.from('users').select('*').eq('role', 'user')
    if (errorAllUsers) {
      errorType.value = 'error'
      errorMessage.value = 'Erro ao buscar usuários.'
      return [];
    }
    return allUsers.value = dataAllUsers
  }

  async function fetchUsersById(userId) {
    const {data: dataUserById, error: errorUserById} = await supabase.from('users').select('*').eq('id', userId).single()
    if (errorUserById) {
      errorType.value = 'error'
      errorMessage.value = 'Erro ao buscar usuário por ID.'
      return null;
    }
    return userById.value = dataUserById
  }

  return {
    fetchAllUsers,
    allUsers,
    errorType,
    errorMessage,
    fetchUsersById,
    userById,
  }
}