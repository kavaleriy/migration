require 'test_helper'

class WelcomeControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

  test "should get map_os" do
    get :map_os
    assert_response :success
  end

  test "should get map_ua" do
    get :map_ua
    assert_response :success
  end

end
