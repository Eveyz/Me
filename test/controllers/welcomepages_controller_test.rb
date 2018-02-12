require 'test_helper'

class WelcomepagesControllerTest < ActionDispatch::IntegrationTest
  test "should get welcome" do
    get welcomepages_welcome_url
    assert_response :success
  end

end
