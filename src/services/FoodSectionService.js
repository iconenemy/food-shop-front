import $api from '../http/axios'

export default class FoodSectionService {
    static async getAll(){
       return $api.get(`food-section/`)
    }
    
    static async findOne(id) {
       return $api.get(`food-section/${id}`)
    }

    static async delete(id) {
       return $api.delete(`food-section/${id}`)
    }

    static async create(fd) {
        return $api.post(`food-section/`, fd)
   }
   
    static async update(id, updateData) {
       return $api.put(`food-section/${id}`, updateData)
    }
}