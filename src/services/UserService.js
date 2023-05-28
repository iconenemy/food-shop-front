import $api from '../http/axios'

export default class UserService {
    static async getAll(){
        return $api.get(`user/`)
    }
    
    static async findOne(id) {
        return $api.get(`user/${id}`)
       
    }

    static async delete(id) {
        return $api.delete(`user/${id}`)
        
    }

    static async create(fd) {
        return $api.post(`user/`, fd)
        
   }
   
    static async update( id, updateData) {
        return $api.put(`user/${id}`, updateData)
    }
}