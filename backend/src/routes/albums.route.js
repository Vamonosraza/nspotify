import { Router  } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.send('albums route with GET method');
});

export default router;