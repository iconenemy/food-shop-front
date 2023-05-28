import $api from '../http/axios'

export default class PaymentService {
    static async getAll() {
        return $api.get(`payment-method/`)
    }

    static async create(formData) {
        return $api.post(`payment-method/`, formData)
    }
    
    static async update(id, updateData) {
        return $api.put(`payment-method/${id}`, updateData)
    }

    static async delete(id) {
        return $api.delete(`payment-method/${id}`)
    }

    static async findOne(id) {
        return $api.get(`payment-method/${id}`)
    }
}