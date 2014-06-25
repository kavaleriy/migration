require 'test_helper'

class ApiControllerTest < ActionController::TestCase
  test "should get get_areas" do
    get :get_areas
    assert_response :success
  end

  test "should get get_regions" do
    get :get_regions
    assert_response :success
  end

  test "should get get_cities" do
    get :get_cities
    assert_response :success
  end

end
