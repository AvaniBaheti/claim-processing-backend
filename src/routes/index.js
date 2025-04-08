import { Router } from 'express'
import auth from '../modules/users/users.routes.js'
import payer from '../modules/payers/payers.routes.js'
import insurance from '../modules/insurance/insurance.routes.js'
import claim from '../modules/claim/claim.routes.js'


const allRoutes = Router()

const defaultRoutes = [

    {
        path: '/auth',
        route: auth,
    },
    {
        path: '/payer',
        route: payer,
    },
    {
        path: '/insurance',
        route: insurance,
    },
    {
        path: '/claim',
        route: claim,
    }


]


defaultRoutes.forEach((route) => {
    allRoutes.use(route.path, route.route);
});
export default allRoutes
