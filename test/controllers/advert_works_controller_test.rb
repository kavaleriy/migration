require 'test_helper'

class AdvertWorksControllerTest < ActionController::TestCase
  setup do
    @advert_work = advert_works(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:advert_works)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create advert_work" do
    assert_difference('AdvertWork.count') do
      post :create, advert_work: { email: @advert_work.email, fio: @advert_work.fio, koatuu_code: @advert_work.koatuu_code, note: @advert_work.note, phone: @advert_work.phone, places: @advert_work.places, rubric: @advert_work.rubric, salary: @advert_work.salary }
    end

    assert_redirected_to advert_work_path(assigns(:advert_work))
  end

  test "should show advert_work" do
    get :show, id: @advert_work
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @advert_work
    assert_response :success
  end

  test "should update advert_work" do
    patch :update, id: @advert_work, advert_work: { email: @advert_work.email, fio: @advert_work.fio, koatuu_code: @advert_work.koatuu_code, note: @advert_work.note, phone: @advert_work.phone, places: @advert_work.places, rubric: @advert_work.rubric, salary: @advert_work.salary }
    assert_redirected_to advert_work_path(assigns(:advert_work))
  end

  test "should destroy advert_work" do
    assert_difference('AdvertWork.count', -1) do
      delete :destroy, id: @advert_work
    end

    assert_redirected_to advert_works_path
  end
end
