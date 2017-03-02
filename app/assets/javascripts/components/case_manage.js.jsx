var CaseContainer = React.createClass({
  getInitialState() {
    return({
      defending: 'Acme',
      adversary: 'Acme',
      qualify: true,
      color: '#2ecc71',
      message: '',
      show: false,
      company_name: ''
    })
  },

  handleSelect(selected, type) {
    if(type == "defending") {
      this.setState({defending: selected});
    } else {
      this.setState({adversary: selected});
    }
    this.setState({show: false});
    this.setState({message: ''});
  },

  render() {
    const labelStyle = {
      color: '#2c3e50',
      fontWeight: 'bold'
    };

    return(
      <div className="row">
        <h2 style={{color: "#8e44ad"}}>New Case</h2>
        <hr/>
        <br/>
        <div className="small-6 columns">
          <div className="row">
            <div className="small-4 columns">
              <label className="text-right middle"><span style={labelStyle}>Defending</span></label>
            </div>
            <div className="small-8 columns">
              <SelectBox list={this.props.company_list} selectOption={this.handleSelect} type="defending"/>
            </div>
          </div>
        </div>
        <div className="small-6 columns">
          <div className="row">
            <div className="small-4 columns">
              <label className="text-right middle"><span style={labelStyle}>Adversary</span></label>
            </div>
            <div className="small-8 columns">
              <SelectBox list={this.props.company_list} selectOption={this.handleSelect} type="adversary"/>
            </div>
          </div>
        </div>
        <br/>
        <button className="button primary small-12 columns" onClick={this.checkDocument}>Create Case</button>
        <br/>
        <br/>
      </div>
    )
  }
});