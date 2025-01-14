import express  from 'express';
import * as controller from '../controllers/vikorController.js';
const router = express.Router();


router.get('/', (req, res) => {
    return res.status(200).json(
    {
        "message": "Successfully retrieved the VIKOR API endpoints.",
        "code": "SUCCESS",
        api_endpoints: [
        {
            "endpoint": "GET /vikor/decision-matrix",
            "description": "Retrieves the decision matrix (F), which represents the alternatives and their values for each criterion."
        },
        {
            "endpoint": "GET /vikor/criteria-weights",
            "description": "Retrieves the criteria weights (W), which define the relative importance of each criterion in the decision-making process."
        },
        {
            "endpoint": "GET /vikor/normalized-matrix",
            "description": "Retrieves the normalized decision matrix (N), which represents the decision matrix values normalized for comparison."
        },
        {
            "endpoint": "GET /vikor/normalized-weights",
            "description": "Retrieves the normalized weighted matrix (F*), which is the normalized matrix after applying the criteria weights."
        },
        {
            "endpoint": "GET /vikor/utility-regret",
            "description": "Retrieves the utility (S) and regret (R) measures, which evaluate the alternatives based on their performance and distance from the ideal solution."
        },
        {
            "endpoint": "GET /vikor/vikor-index",
            "description": "Retrieves the VIKOR index (Q) values, which combine utility and regret measures to rank the alternatives."
        },
        {
            "endpoint": "GET /vikor/alternative-ranking",
            "description": "Retrieves the ranked alternatives based on the VIKOR index (Q), ordering the alternatives from the best to the worst."
        },
        {
            "endpoint": "GET /vikor/compromise-solution",
            "description": "Retrieves the best compromise solution from the ranked alternatives, which balances utility and regret measures."
        }
    ]


})
})
router.get('/decision-matrix', controller.decisionMatrix)
router.get('/criteria-weights', controller.criteriaWeights)
router.get('/normalized-matrix', controller.normalizedMatrix)
router.get('/normalized-weights', controller.normalizedWeights)
router.get('/utility-regret', controller.utilityRegret)
router.get('/vikor-index', controller.vikorIndex)
router.get('/alternative-ranking', controller.alternativeRanking)
router.get('/compromise-solution', controller.compromiseSolution)

export default router