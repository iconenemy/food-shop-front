import $api from '../http/axios'

export default class FoodItem {
    static async getAll(){
        return $api.get(`food-item/`)
    }
    
    static async findOne(id) {
        return $api.get(`food-item/${id}`)
    }

    static async delete(id) {
       return $api.delete(`food-item/${id}`)
    }

    static async create(fd) {
       return $api.post(`food-item/`, fd)
   }
   
    static async updateOne( id, updateData) {
        return $api.put(`food-item/${id}`, updateData)
    }
}