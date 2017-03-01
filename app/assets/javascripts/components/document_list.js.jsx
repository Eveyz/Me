var DocumentList = React.createClass({
  getInitialState() {
    return({
      document: 'α1',
      personnel: 'amy',
      qualify: true,
      color: '#2ecc71',
      message: '',
      conflict_cases: [],
      show: false,
      company_name: ''
    })
  },

  handleSelect(selected, type) {
    if(type == "doc") {
      this.setState({document: selected});
    } else {
      this.setState({personnel: selected});
    }
    this.setState({show: false});
    this.setState({message: ''});
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
      success: function(data) {
        console.log(data);
        qualify = data["qualify"];
        conflict_cases = data["conflict_cases"];
        company_name = data["company_name"];
        this.setState({qualify: qualify});
        if (qualify) {
          this.setState({
            message: personnel + " check " + document + " successfully!",
            color: '#2ecc71',
            show: false
          });
        } else {
          this.setState({
            message: personnel + " cannot check " + document + "!",
            color: '#e74c3c',
            conflict_cases: conflict_cases,
            company_name: company_name,
            show: true
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

    fontStyle= {
      fontWeight: 'bold',
      color: '#3498db'
    }

    let total_list = <div>
                        <hr/>
                        <div className="callout">
                          <p>Document <span style={fontStyle}>{this.state.document}</span> is about company <span style={fontStyle}>{this.state.company_name}</span></p>
                        </div>
                        <h4 style={{color: '#2c3e50'}}>Conflict Cases</h4>
                        <List list={this.state.conflict_cases} type="#e67e22" side={this.state.personnel}/>
                      </div>

    let conflict_list = this.state.show ? total_list : null;

    return(
      <div className="row">
        <h2 style={{color: "#8e44ad"}}>Check Document</h2>
        <hr/>
        {renderMessage}
        <br/>
        <div className="small-6 columns">
          <div className="row">
            <div className="small-5 columns">
              <label className="text-right middle"><span style={labelStyle}>Choose Personnel</span></label>
            </div>
            <div className="small-7 columns">
              <SelectBox list={this.props.personnel_list} selectOption={this.handleSelect} type="personnel"/>
            </div>
          </div>
        </div>
        <div className="small-6 columns">
          <div className="row">
            <div className="small-5 columns">
              <label className="text-right middle"><span style={labelStyle}>Choose Document</span></label>
            </div>
            <div className="small-7 columns">
              <SelectBox list={this.props.document_list} selectOption={this.handleSelect} type="doc"/>
            </div>
          </div>
        </div>
        <br/>
        <button className="button primary small-12 columns" onClick={this.checkDocument}>Check Document</button>
        <br/>
        <br/>
        {conflict_list}
        <br/>
      </div>
    )
  }
});
