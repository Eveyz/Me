var CaseContainer = React.createClass({
  getInitialState() {
    return({
      defending: 'Acme',
      adversary: 'Acme',
      personnel: 'amy',
      duplicated_cases: [],
      qualify: true,
      color: '#2ecc71',
      message: '',
      show: false,
      company_name: '',
      created_successfully: false,
      case_personnel: ''
    })
  },

  handleSelect(selected, type) {
    if(type == "defending") {
      this.setState({defending: selected});
    } else if(type == "adversary") {
      this.setState({adversary: selected});
    } else {
      this.setState({personnel: selected});
    }
    this.setState({show: false});
    this.setState({message: ''});
  },

  checkPersonnel() {
    let personnel = this.state.personnel;
    let defending = this.state.defending;
    let adversary = this.state.adversary;
    let getUrl = '/welcomepages/create_case';
    if (defending == adversary) {
      this.setState({
        message: "Please choose two different company",
        color: '#e67e22',
        show: false,
        created_successfully: false
      });
    } else {
      $.ajax({
        url: getUrl,
        dataType: 'json',
        data: {personnel: personnel, defending: defending, adversary: adversary},
        content: this,
        type: 'POST',
        success: function(data) {
          console.log(data);
          qualify = data["qualify"];
          conflict_cases = data["conflict_cases"];
          duplicated_cases = data["duplicated_cases"];
          case_personnel = data["case_personnel"];
          this.setState({qualify: qualify});
          this.setState({conflict_cases: conflict_cases});
          this.setState({duplicated_cases: duplicated_cases});
          console.log(duplicated_cases.length);
          if (duplicated_cases.length > 0) {
            // case existed
            this.setState({
              message: "Case exists. Please choose two other companies.",
              color: '#e67e22',
              created_successfully: false,
              show: true,
              case_personnel: case_personnel
            });
          } else {
            // case not existed
            if (qualify) {
              this.setState({
                message: "New case has been created successfully. " + personnel + " will handle this case.",
                color: '#2ecc71',
                created_successfully: true,
                show: false
              });
            } else {
              this.setState({
                message: personnel + " cannot be assigned to this new case!",
                color: '#e74c3c',
                conflict_cases: conflict_cases,
                created_successfully: false,
                show: true
              });
            }
          }
          console.log(qualify);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(getUrl, status, err.toString());
        }.bind(this)
      });
    }
  },

  createAnotherCase() {
    this.setState({
      created_successfully: false,
      message: ''
    });
  },

  render() {
    const labelStyle = {
      color: '#2c3e50',
      fontWeight: 'bold'
    };

    const successStyle = {
      color: '#2ecc71',
      fontWeight: 'bold'
    };

    const personnelStyle = {
      color: '#3498db',
      fontWeight: 'bold'
    };

    const failStyle = {
      color: '#e74c3c',
      fontWeight: 'bold'
    };

    const messageStyle = {
      color: 'white',
      fontWeight: 'bold',
      padding: '10px 20px 10px 20px',
      backgroundColor: this.state.color
    };

    const message = <div style={messageStyle} className="text-center">{this.state.message}</div>;

    const renderMessage = this.state.message == '' ? null : message;

    let total_list =  this.state.duplicated_cases.length > 0 ?
                      <div>
                        <hr/>
                        <h4 style={{color: '#2c3e50'}}>Conflict Cases</h4>
                        <List list={this.state.duplicated_cases} type="#e67e22" side={this.state.case_personnel}/>
                      </div> :
                      <div>
                        <hr/>
                        <h4 style={{color: '#2c3e50'}}>Conflict Cases</h4>
                        <List list={this.state.conflict_cases} type="#e67e22" side={this.state.personnel}/>
                      </div>

    let conflict_list = this.state.show ? total_list : null;

    let form = <div className="row">
                    <h2 style={{color: "#8e44ad"}}>New Case</h2>
                    <hr/>
                    {renderMessage}
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
                    <div className="small-12 columns">
                      <div className="row">
                        <div className="small-2 columns">
                          <label className="text-right middle"><span style={labelStyle}>Assign a lawyer</span></label>
                        </div>
                        <div className="small-10 columns">
                          <SelectBox list={this.props.personnels} selectOption={this.handleSelect} type="personnel"/>
                        </div>
                      </div>
                    </div>
                    <br/>
                    <button className="button primary small-12 columns" onClick={this.checkPersonnel}>Create Case</button>
                    <br/>
                    <br/>
                    {conflict_list}
                    <br/>
                    <br/>
                  </div>

    const another_new_case =  <div>
                                <h3 style={labelStyle}>New Case has been created successfully!</h3>
                                <h4><span style={personnelStyle}>{this.state.personnel}</span> will handle the case <span style={successStyle}>{this.state.defending}</span> against <span style={failStyle}>{this.state.adversary}</span></h4>
                                <br/>
                                <button className="button success" style={{fontWeight: 'bold'}} onClick={this.createAnotherCase}>Create Another New Case</button>
                              </div>

    const content = this.state.created_successfully ? another_new_case : form

    return(
      <div>
        {content}
      </div>
    )
  }
});
