/*
 # Stock table

 Imagine you have the following table with stock values.

 Company  |   Value
 ========================
 APPL     |   € 1,234
 GOOG     |   € 1,400
 YHOO     |   € 3
 CWIK     |   € 12
 ...up to 50

 You will have the following API endpoint, that will return
 the 50 values.

 /stocks.json

 ## We want you to:

 1. Design the response of the endpoint. How will the data
 look like when you call it?
 2. Write a piece of Javascript that will call the endpoint to
 fetch the data and...
 3. ...render the information on the page on a <table>.
 4. Reload the contents every 10 seconds.

 ## Things to consider:

 - Feel free to use Modern JS (arrow functions, spread op, etc.)
 - It needs to work in IE9 (sorry!).
 - Use any library you're comfortable with. We don't care if you
 use React, or Vue, or Angular, or plain JS. If we are not
 familiar with it we might ask you to fill our gaps.

 Happy coding! :)
 */

/*

 --------|---------|---------|
 ===========>
 =============>
 =============>



 --------|--------------|
 ==>
 ==============>

 */


const ItemTemplate = (item) => (
    <li className="stocks__item">
        This is our item  = { item }
    </li>
);


// Your code goes here

class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
        this.getData();
    }

    /*callPromise() {
     return new Promise(function(resolve) {
     return resolve(fetch('/stocks.json'));
     });

     }*/

    makeRequest() {

        fetch('/stocks.json').then((list) => {
            this.setState({
                'list': list
            });
            this.getData();
        })
    }

    getData() {
        const timeOut = 10000;
        setTimeout(() => {
            this.makeRequest()
        }, timeOut);
    }

    render() {
        const { list } = this.state;
        return (
            <div className="stocks">
                { list.map((item)=> { return ItemTemplate(item); }) }
            </div>
        );
    }
}




