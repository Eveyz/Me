var DocumentList = React.createClass({
  getInitialState() {
    return({
      document: 'α',
      personnel: 'amy',
      qualify: true,
      color: '#2ecc71',
      message: ''
    })
  },

  handleSelect(selected, type) {
    if(type == "doc") {
      this.setState({document: selected});
    } else {
      this.setState({personnel: selected});
    }
  },

  checkDocument() {
    let personnel = this.state.personnel;
    let document = this.state.document;
    let getUrl = '/welcomepages/check_document_qualification';
    $.ajax({
      url: getUrl,
      dataType: 'json',
      data: {personnel: personnel, document: document},
      content: this,
      type: 'POST',
      success: function(qualify) {
        this.setState({qualify: qualify});
        if (qualify) {
          this.setState({
            message: personnel + " check " + document + " successfully!",
            color: '#2ecc71'
          });
        } else {
          this.setState({
            message: personnel + " cannot check " + document + "!",
            color: '#e74c3c'
          });
        }
        console.log(qualify);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(getUrl, status, err.toString());
      }.bind(this)
    });
  },

  render() {
    const labelStyle = {
      color: '#2c3e50',
      fontWeight: 'bold'
    };

    const messageBoxStyle = {
      backgroundColor: '#e74c3c'
    };

    const messageStyle = {
      color: 'white',
      fontWeight: 'bold',
      padding: '10px 20px 10px 20px',
      backgroundColor: this.state.color
    };

    const message = <div style={messageStyle} className="text-center">{this.state.message}</div>;

    const renderMessage = this.state.message == '' ? null : message;

    return(
      <div className="row">
        <h2 style={{color: "#8e44ad"}}>Check Document</h2>
        <hr/>
        {renderMessage}
        <br/>
        <div className="small-6 columns">
          <div className="row">
            <div className="small-4 columns">
              <label className="text-right middle"><span style={labelStyle}>Choose Personnel</span></label>
            </div>
            <div className="small-8 columns">
              <SelectBox list={this.props.personnel_list} selectOption={this.handleSelect} type="personnel"/>
            </div>
          </div>
        </div>
        <div className="small-6 columns">
          <div className="row">
            <div className="small-4 columns">
              <label className="text-right middle"><span style={labelStyle}>Choose Document</span></label>
            </div>
            <div className="small-8 columns">
              <SelectBox list={this.props.document_list} selectOption={this.handleSelect} type="doc"/>
            </div>
          </div>
        </div>
        <br/>
        <button className="button primary small-12 columns" onClick={this.checkDocument}>Check Document</button>
        <br/>
      </div>
    )
  }
});
