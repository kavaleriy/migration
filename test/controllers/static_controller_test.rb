require 'test_helper'

class StaticControllerTest < ActionController::TestCase
  test "should get phones" do
    get :phones
    assert_response :success
  end

end
