require 'test_helper'

class WelcomepagesControllerTest < ActionDispatch::IntegrationTest
  test "should get legaloffice" do
    get welcomepages_legaloffice_url
    assert_response :success
  end

end
