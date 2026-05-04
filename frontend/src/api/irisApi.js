import axios from 'axios'

const ML_API = axios.create({
  baseURL: import.meta.env.VITE_ML_API_URL || 'http://localhost:5000',
})

export async function getGradCamIris(imageFile, layerName = 'top_conv') {
  const formData = new FormData()
  formData.append('image', imageFile)
  formData.append('layer_name', layerName)

  const response = await ML_API.post('/iris/grad-cam', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob'
  })

  return URL.createObjectURL(response.data)
}
