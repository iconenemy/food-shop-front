import $api from '../http/axios'

export default class FoodService {
    static async getAllFoodSection(){
        return $api.get(`food/public/section/all`)
    }

    static async getAllFoodItemByFoodSectionId(id){
        return $api.post(`food/public/item/all`, {id: id})
    }

    static async getFoodItemById(id){
        return $api.get(`food/public/item/${id}/find`)
    }

    static async getFoodItemsById(id, count, offset) {
        return $api.get(`food/public/item/get-list?id=${id}&count=${count}&offset=${offset}`)
    }
}