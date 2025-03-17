const {Category} = require ('../modeld/Category');

async function createCategoryByName(req, res) {
    try {
        const categoryName = req.params.name;
        const categoryInstance = new Category(null, categoryName);
        const result = await categoryInstance.getCategory_Name();

        if (result) {
            res.status(200).json({categoryName: result});
        }else {
            res.status(404).json({message: 'Category not found'});
        }
    }catch (error) {
        console.error('Error getting category by name: ', error);
        res.status(500).json({message: 'Internal server error'});
    }
}