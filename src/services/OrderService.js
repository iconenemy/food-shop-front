import $api from '../http/axios'

export default class OrderService {
    static async create(formData) {
        return $api.post(`order/`, formData)
    }

    static async delete(id) {
        return $api.delete(`order/${id}`)
    }

    static async update(id, updateData) {
        return $api.put(`order/${id}`, updateData)
    }

    static async getAll() {
        return $api.get(`order/`)
    }

    static async findOne(id) {
        return $api.get(`order/${id}`)
    }

    static async changeStatusById(id) {
        return $api.patch(`order/${id}/status`)
    }
}