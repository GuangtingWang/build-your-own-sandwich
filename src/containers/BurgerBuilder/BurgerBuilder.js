import React,{ Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


const INGREDIENT_PRICES = {
    salad: .5,
    cheese:.4,
    meat:1.3,
    bacon:.7
}

class BurgerBuilder extends Component{

    constructor(props){
        super(props);
        this.state = {
            ingredients:null,
            totalPrice:4,
            purchasable:false,
            purchasing:false,
            loading:false,
            error:false
        }
    }

    componentDidMount(){
        axios.get('https://react-my-burger-a66ea.firebaseio.com/orders/ingredients.json')
        .then(res => {
            let basePrice = this.state.totalPrice;
            let i = {...res.data};
            let addition = Object.keys(i).map(ingredient => {
                return res.data[ingredient] * INGREDIENT_PRICES[ingredient]
            }).reduce((acc,cur)=>{
                return acc + cur
            },0).toFixed(2)
            this.setState({ingredients:res.data,
                totalPrice:4 + parseFloat(addition)
            })
        })
        .catch(err=>{
            this.setState({error:true})
        })
    }

    purchaseHandler = () => {
        this.setState({purchasing:true})
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum,el)=> {return sum + el},0);
            this.setState({purchasable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCounted = oldCount +1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCounted;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({
            totalPrice:newPrice,
            ingredients:updatedIngredients
        }) 
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) return;
        const updatedCounted = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCounted;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({
            totalPrice:newPrice,
            ingredients:updatedIngredients
        }) 
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseCancelHandler = ()=> {
        this.setState({purchasing:false})
    }

    purchaseContinueHandler = ()=> {
        // alert('you continue!');
        this.setState({loading:true});
        const order = {
            ingredients:this.state.ingredients,
            price:(this.state.totalPrice * 1.07).toFixed(2),
            customer:{
                name:'Jeremy',
                address:{
                    street:'180 Erie ave',
                    zip:'08648'
                },
                email:'test@test.com'
            },
            deliveryMethod:'fastest'
        }
        axios.post('/orders.json',order)
            .then(res => {
                this.setState({loading:false,purchasing:false})
            })
            .catch(err => this.setState({loading:false,purchasing:false}));
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;

        let burger = this.state.error? <p>Ingredients can't be loaded.</p>:<Spinner />;

        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients = {this.state.ingredients}/>
                    <BuildControls 
                    ingredientAdded = {this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price = {this.state.totalPrice}
                    purchasable = {this.state.purchasable}
                    ordered = {this.purchaseHandler}/>
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.state.totalPrice} /> ;    
            }
            if(this.state.loading){
                orderSummary = <Spinner />
            } 

        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
};

export default  withErrorHandler(BurgerBuilder,axios);
