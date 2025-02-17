import {Router} from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.send('user route with GET method');
});
router.post('/', (req, res) => {
    res.send('user route with GET method');
});
router.delete('/', (req, res) => {
    res.send('user route with GET method');
});
router.get('/', (req, res) => {
    res.send('user route with GET method');
});
router.get('/', (req, res) => {
    res.send('user route with GET method');
});

export default router;