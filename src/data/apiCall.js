// import ApiClient from './ApiClient.ts'
// import { RequestType } from '../Constant.ts'
// import { async } from '@firebase/util'
import axios from 'axios'
import {Urls} from "./urls"
import { showErrorMsg,msgPosition } from '../contextProviders/toastMessegeProvider'
const axoisInstanceSdk = axios.create({
  baseURL: Urls.sdkBaseUrl,
  timeout: 2000,
  headers: { apid: process.env.REACT_APP_API_ID??"d1e7f644-552c-4a4e-a4e3-3233b876c060"  },
})
axoisInstanceSdk.interceptors.response.use((response)=>{
  if(response?.data?.message?.ack?.status === 'NACK'){
    showErrorMsg({position:msgPosition.BOTTOM_RIGHT,msg:"Oops something went wrong with the seller partner"})
  }
  else{
    return response
  }
},
function (error) {
  console.log("res error")
  // Do something with request error
  return Promise.reject(error);
}
)
const axoisInstanceMap = axios.create({
  baseURL: Urls.osmBaseUrl,
  timeout: 10000,
  headers: {
    'Access-Control-Allow-Origin': 'https://o2cj2q.csb.app',
  },
})
export const verfyCartUsingSdk = async (payload) => {
  return await axoisInstanceSdk.post(Urls.verifyCartUrl, payload)
}

export const confirmOrderUsingSdk = async (payload) => {
  return await axoisInstanceSdk.post(Urls.OrderUrl, payload)
}
export const getLatLngFromAddress = async (address) => {
  let url = `/search?
    street=${address.street}
    &city=${address.city}
    &state=${address.state}
    &country=India
    &postalcode=${address.areaCode}&format=json`
 
  return await axoisInstanceMap.post(url)
}
export const trackOrderFromSdk=async(orderId)=>{
  return axoisInstanceSdk.post(`${Urls.OrderUrl}/${orderId}/track`,{
    "city_code": "std_080"
})

}
export const cancelOrderFromSdk=async(orderId)=>{
 
  return axoisInstanceSdk.post(`${Urls.OrderUrl}/${orderId}/cancel`,{
    "city_code": "std:080",
    "type": "CANCEL",
    "meta": {
        "cancel_reason_code": "001",
        
    }
})
}
export const supportOrderFromSdk=async(orderId,payload)=>{
  return axoisInstanceSdk.post(Urls.orderSupportUrl,payload)
}
export const returnOrderUsingSdk=(payload,orderId)=>{
  return axoisInstanceSdk.post(`${Urls.OrderUrl}/${orderId}/return`,payload)
}
export const getAddressFromLatLng=async({lat,lon})=>{
  const url=`${Urls.reverseGeoCodeUrl}?lat=${lat}&lon=${lon}&format=json`

  return await axoisInstanceMap.get(url)
}
export const getLocationSuggetion=async(query)=>{
  return await axoisInstanceMap.get(`${Urls.goeLocationSuggetion}?q=${query}&format=json&countrycode=IN&&limit=5`)
}

