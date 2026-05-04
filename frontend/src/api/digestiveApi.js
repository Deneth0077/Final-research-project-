import axios from 'axios'

const ML_API = axios.create({
  baseURL: import.meta.env.VITE_ML_API_URL || 'http://localhost:5000',
})

export async function predictDigestive(imageFile) {
  const formData = new FormData()
  formData.append('image', imageFile)

  const { data } = await ML_API.post('/digestive/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return data
}

export async function getGradCamDigestive(imageFile, layerName = 'top_conv') {
  const formData = new FormData()
  formData.append('image', imageFile)
  formData.append('layer_name', layerName)

  const response = await ML_API.post('/digestive/grad-cam', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob'
  })

  return URL.createObjectURL(response.data)
}

export async function getDigestiveHealth() {
  const { data } = await ML_API.get('/health')
  return data
}
