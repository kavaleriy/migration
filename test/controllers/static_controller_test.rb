require 'test_helper'

class StaticControllerTest < ActionController::TestCase
  test "should get centers" do
    get :centers
    assert_response :success
  end

end
