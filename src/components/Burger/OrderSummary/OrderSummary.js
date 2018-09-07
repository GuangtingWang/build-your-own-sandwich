import React,{ Component } from 'react';
import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component{


    componentWillUpdate(){
        console.log('order summary will update')
    }

    render(){

        const ingredientSummary = Object.keys(this.props.ingredients)
        .map(igKey => {
                return (
                    <li key={igKey}>
                        <span style={{textTransform:'capitalize'}}>{igKey}</span> : {this.props.ingredients[igKey]}
                    </li>
                )
            });

        return(
            <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the folling ingredients:</p>
            <ul>
                {this.ingredientSummary}
            </ul>
            <p style={{fontSize:'90%'}}>
            PRICE: {this.props.price.toFixed(2)}<br />
            TAX: {(this.props.price * 0.07).toFixed(2)}<br />
            <strong>TOTAL PRICE: {(this.props.price * 1.07).toFixed(2)}</strong>
            </p>
            <p>Continue to Checkout?</p>
            <Button clicked={this.props.purchaseCanceled} btnType='Danger'>CANCEL</Button>
            <Button clicked={this.props.purchaseContinued} btnType='Success'>CONTINUE</Button>
        </Aux>
        )
    }
}

export default OrderSummary;