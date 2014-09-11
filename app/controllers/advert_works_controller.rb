class AdvertWorksController < ApplicationController
  before_filter :authenticate_user!
  load_and_authorize_resource

  before_action :set_advert_work, only: [:show, :edit, :update, :destroy]

  before_action :set_cookies, only: [:create, :update]

  # GET /advert_works
  # GET /advert_works.json
  def index
    @advert_works = (current_user.has_role? :editor) ? AdvertWork.where('qty_places > 0').order(:created_at => :desc) : AdvertWork.users_adverts(current_user.email)
    @advert_works = @advert_works.paginate(:page => params[:page], :per_page => 10)
  end

  # GET /advert_works/1
  # GET /advert_works/1.json
  def show
  end

  # GET /advert_works/new
  def new
    @advert = Advert.new({:email => current_user.email, :fio => cookies['user_fio'], :phone => cookies['user_phone']})
    @advert_work = @advert.build_advert_work
  end

  # GET /advert_works/1/edit
  def edit
  end

  # POST /advert_works
  # POST /advert_works.json
  def create
    @advert_work = AdvertWork.new(advert_work_params)

    respond_to do |format|
      if @advert_work.save
        format.html { redirect_to @advert_work, notice: 'Ваше оголошення розміщено на сайті!' }
        format.json { render :show, status: :created, location: @advert_work }
      else
        format.html { render :new }
        format.json { render json: @advert_work.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /advert_works/1
  # PATCH/PUT /advert_works/1.json
  def update
    respond_to do |format|
      if @advert_work.update(advert_work_params)
        format.html { redirect_to @advert_work, notice: 'Зміни в оголошення збережено.' }
        format.json { render :show, status: :ok, location: @advert_work }
      else
        format.html { render :edit }
        format.json { render json: @advert_work.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /advert_works/1
  # DELETE /advert_works/1.json
  def destroy
    @advert_work.destroy
    respond_to do |format|
      format.html { redirect_to advert_works_url, notice: t('adverts.form.destroyed') }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_advert_work
      @advert_work = AdvertWork.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def advert_work_params
      params.require(:advert_work).permit(:advert_id, :profession_id, :places, :salary, advert_attributes: [:id, :koatuu_code, :qty_places, :email, :fio, :phone, :note])
    end

    def set_cookies
      response.set_cookie('user_fio', advert_work_params[:advert_attributes][:fio])
      response.set_cookie('user_phone', advert_work_params[:advert_attributes][:phone])
    end

end
