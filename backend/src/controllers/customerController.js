const customerService =
    require("../services/customerService");


/*
|--------------------------------------------------------------------------
| GET ALL CUSTOMERS
|--------------------------------------------------------------------------
*/

const getAllCustomers =
    async (req, res, next) => {

        try {

            const {
                search = "",
                page = 1,
                limit = 10
            } = req.query;

            const result =
                await customerService
                    .getAllCustomers({
                        search,
                        page,
                        limit
                    });

            res.status(200).json({

                success: true,

                data: result

            });

        } catch (error) {

            next(error);

        }
    };


/*
|--------------------------------------------------------------------------
| GET CUSTOMER BY ID
|--------------------------------------------------------------------------
*/

const getCustomerById =
    async (req, res, next) => {

        try {

            const {
                id
            } = req.params;

            const customer =
                await customerService
                    .getCustomerById(id);

            res.status(200).json({

                success: true,

                data: customer

            });

        } catch (error) {

            next(error);

        }
    };


module.exports = {
    getAllCustomers,
    getCustomerById
};