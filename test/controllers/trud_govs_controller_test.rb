require 'test_helper'

class TrudGovsControllerTest < ActionController::TestCase
  setup do
    @trud_gov = trud_govs(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:trud_govs)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create trud_gov" do
    assert_difference('TrudGov.count') do
      post :create, trud_gov: { koatuu_code: @trud_gov.koatuu_code, trud_code: @trud_gov.trud_code }
    end

    assert_redirected_to trud_gov_path(assigns(:trud_gov))
  end

  test "should show trud_gov" do
    get :show, id: @trud_gov
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @trud_gov
    assert_response :success
  end

  test "should update trud_gov" do
    patch :update, id: @trud_gov, trud_gov: { koatuu_code: @trud_gov.koatuu_code, trud_code: @trud_gov.trud_code }
    assert_redirected_to trud_gov_path(assigns(:trud_gov))
  end

  test "should destroy trud_gov" do
    assert_difference('TrudGov.count', -1) do
      delete :destroy, id: @trud_gov
    end

    assert_redirected_to trud_govs_path
  end
end
