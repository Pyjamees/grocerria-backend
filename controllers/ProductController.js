import Product from "../models/ProductModel.js"
import mongoose from "mongoose";
import _ from "lodash";
import * as dotenv from 'dotenv'
dotenv.config()


export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getProductsBySearchInput = async (req, res) => {
    try {

        mongoose.connect("mongodb+srv://"+process.env.mongodb_user+":"+process.env.mongodb_pass+"@cluster0.bba3wy4.mongodb.net/GroceriaDatabase", {useNewUrlParser: true, useUnifiedTopology: true});        

        const searchSortInput = req.params['searchSortInput'].split('&');
        
        const searchInput = searchSortInput[0];
        const sortCategory = _.lowerCase(searchSortInput[1]);
        const sortOrder = Number(searchSortInput[2]);
        const carbohydrateMinimum = Number(searchSortInput[3]);
        const carbohydrateMaximum  = Number(searchSortInput[4]);
        const proteinMinimum = Number(searchSortInput[5]);
        const proteinMaximum = Number(searchSortInput[6]);
        const totalFatMinimum = Number(searchSortInput[7]);
        const totalFatMaximum = Number(searchSortInput[8]);

        console.log(searchSortInput)

        const compoundTextRangeAgg = {
          'should': [
            {
              'text': {
                'query': searchInput, 
                'path': 'name', 
                'score': {
                  'boost': {
                    'value': 5
                  }
                }
              }
            }, {
              'text': {
                'query': searchInput, 
                'path': 'name', 
                'fuzzy': {
                  'maxEdits': 1, 
                  'prefixLength': 1
                }, 
                'score': {
                  'boost': {
                    'value': 2
                  }
                }
              }
            }, 
            {
              'text': {
                'query': searchInput, 
                'path': 'keywords', 
                'fuzzy': {
                  'maxEdits': 1, 
                  'prefixLength': 1
                }, 
                'score': {
                  'boost': {
                    'value': 1
                  }
                }
              }
            }
          ],
          "minimumShouldMatch": 1,
          'must': [
            {
              'range': {
                  'path': 'percentageCarbohydrate', 
                  'gte': carbohydrateMinimum, 
                  'lte': carbohydrateMaximum
              }
            }, {
              'range': {
                  'path': 'percentageProtein', 
                  'gte': proteinMinimum, 
                  'lte': proteinMaximum
              }
            }, {
              'range': {
                  'path': 'percentageTotalFat', 
                  'gte': totalFatMinimum, 
                  'lte': totalFatMaximum
              }
            }
          ]
        }

        const compoundRangeAgg = {
          'must': [
            {
              'range': {
                  'path': 'percentageCarbohydrate', 
                  'gte': carbohydrateMinimum, 
                  'lte': carbohydrateMaximum
              }
            }, {
              'range': {
                  'path': 'percentageProtein', 
                  'gte': proteinMinimum, 
                  'lte': proteinMaximum
              }
            }, {
              'range': {
                  'path': 'percentageTotalFat', 
                  'gte': totalFatMinimum, 
                  'lte': totalFatMaximum
              }
            }
          ]
        }

        const searchAgg = {
          '$search': {
            'index': 'GrocerRiaDatabaseIndex', 
            'compound': searchInput != "" ? compoundTextRangeAgg : compoundRangeAgg 
          }
        }

        const sortAggEnergy = 
        {
          '$sort': {'energy': sortOrder}
        }

        const sortAggCarbohydrate = 
        {
          '$sort': {'carbohydrate': sortOrder}
        }

        const sortAggProtein = 
        {
          '$sort': {'protein': sortOrder}
        }

        const sortAggTotalFat = 
        {
          '$sort': {'totalFat': sortOrder}
        }

        const sortAggPricePerQuantity = 
        {
          '$sort': {'pricePerQuantity': sortOrder}
        }

        const sortAggScore = 
        {
          '$sort': {
            'score': {
              '$meta': 'textScore'
            }
          }
        }

        const sortAgg = sortCategory === 'energy' ? sortAggEnergy : sortCategory === 'carbohydrate' ? sortAggCarbohydrate : sortCategory === 'protein' ? sortAggProtein : sortCategory === 'total fat' ? sortAggTotalFat : sortCategory === 'price' ? sortAggPricePerQuantity : sortCategory === '' ? sortAggScore : ""


        let products = []

        products = await Product.aggregate([searchAgg, sortAgg,  
            {
              '$redact': {
                '$cond': {
                  'if': {
                    '$or': [
                      {
                        '$eq': [
                          '$energy', -1
                        ]
                      },
                      {
                        '$eq': [
                          '$energy', 0
                        ]
                      },
                      {
                        '$eq': [
                          '$carbohydrate', -1
                        ]
                      },
                      {
                        '$eq': [
                          '$protein', -1
                        ]
                      },
                      {
                        '$eq': [
                          '$totalFat', -1
                        ]
                      },
                      {
                        '$eq': [
                          '$price', "-"
                        ]
                      },
                    ]
                  }, 
                  'then': '$$PRUNE', 
                  'else': '$$KEEP'
                }
              }
            }
          ]) 

        console.log(products)
        res.json(products);

        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}