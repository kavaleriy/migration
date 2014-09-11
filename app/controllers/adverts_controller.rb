class AdvertsController < ApplicationController
  before_filter :authenticate_user!
  load_and_authorize_resource

  before_action :set_advert, only: [:show, :edit, :update, :destroy]

  before_action :set_cookies, only: [:create, :update]

  # GET /adverts
  # GET /adverts.json
  def index
    if current_user.has_role? :editor
      @adverts = Advert.where('qty_places > 0').order(:created_at => :desc)
    else
      @adverts = Advert.users_adverts(current_user.email)
    end

    @adverts = @adverts.paginate(:page => params[:page], :per_page => 10)
  end

  # GET /adverts/1
  # GET /adverts/1.json
  def show
  end

  # GET /adverts/new
  def new
    @advert = Advert.new({:email => current_user.email, :fio => cookies['user_fio'], :phone => cookies['user_phone']})
  end

  # GET /adverts/1/edit
  def edit
  end

  # POST /adverts
  # POST /adverts.json
  def create

    @advert = Advert.new(advert_params)
    #if !verify_recaptcha
      respond_to do |format|
        if @advert.save
          format.html { redirect_to @advert, notice: t('adverts.form.created') }
        else
          format.html { render :new }
        end
      end
    #else
    #  #binding.pry
    #  respond_to do |format|
    #    format.html { render :new, notice: 'невірний CAPTCHA код.' }
    #    format.js { render json: { notice: 'невірний CAPTCHA код.' }, status: :unprocessable_entity }
    #  end
    #end
  end

  # PATCH/PUT /adverts/1
  # PATCH/PUT /adverts/1.json
  def update
    respond_to do |format|
      if @advert.update(advert_params)
        format.html { redirect_to @advert, notice: t('adverts.form.updated') }
        format.json { render :show, status: :ok, location: @advert }
      else
        format.html { render :edit }
        format.json { render json: @advert.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /adverts/1
  # DELETE /adverts/1.json
  def destroy
    @advert.destroy
    respond_to do |format|
      format.html { redirect_to adverts_url, notice: t('adverts.form.destroyed') }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_advert
      @advert = Advert.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def advert_params
      params.require(:advert).permit(:koatuu_code, :house_id, :address, :cost, :qty_places, :has_school, :has_kgarden, :email, :fio, :phone, :note)
    end

    def set_cookies
      response.set_cookie('user_fio', advert_params[:fio])
      response.set_cookie('user_phone', advert_params[:phone])
    end

end
