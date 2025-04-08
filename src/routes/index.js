import { Router } from 'express'


const allRoutes = Router()

const defaultRoutes = [


]

/*This is how we can define Routes */

defaultRoutes.forEach((route) => {
    allRoutes.use(route.path, route.route);
});
export default allRoutes
