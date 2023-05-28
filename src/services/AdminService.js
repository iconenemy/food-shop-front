import $api from '../http/axios'

export default class AdminService {
    static async getModels(){
        return $api.get('admin/models')
    }
}
