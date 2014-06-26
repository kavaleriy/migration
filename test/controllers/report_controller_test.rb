require 'test_helper'

class ReportControllerTest < ActionController::TestCase
  test "should get amount_places" do
    get :amount_places
    assert_response :success
  end

  test "should get amount_by_type" do
    get :amount_by_type
    assert_response :success
  end

  test "should get amount_of_job" do
    get :amount_of_job
    assert_response :success
  end

end
