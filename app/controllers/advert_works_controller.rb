class AdvertWorksController < ApplicationController
  before_action :set_advert_work, only: [:show, :edit, :update, :destroy]

  # GET /advert_works
  # GET /advert_works.json
  def index
    @advert_works = AdvertWork.all
  end

  # GET /advert_works/1
  # GET /advert_works/1.json
  def show
  end

  # GET /advert_works/new
  def new
    @advert = Advert.new
    @advert_work = @advert.build_advert_work
  end

  # GET /advert_works/1/edit
  def edit
  end

  # POST /advert_works
  # POST /advert_works.json
  def create
    @advert = Advert.new(advert_params)

    respond_to do |format|
      if @advert_work.save
        format.html { redirect_to @advert_work, notice: 'Advert work was successfully created.' }
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
        format.html { redirect_to @advert_work, notice: 'Advert work was successfully updated.' }
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
      format.html { redirect_to advert_works_url, notice: 'Advert work was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_advert_work
      binding.pry
      @advert_work = AdvertWork.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def advert_work_params
      binding.pry
      params.require(:advert_work).permit(:koatuu_code, :email, :fio, :phone, :note, :rubric, :places, :salary)
    end
end
