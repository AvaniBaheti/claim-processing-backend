import { Router } from 'express'
import auth from '../modules/users/users.routes.js'


const allRoutes = Router()

const defaultRoutes = [

    {
        path: '/auth',
        route: auth,
    },


]


defaultRoutes.forEach((route) => {
    allRoutes.use(route.path, route.route);
});
export default allRoutes
