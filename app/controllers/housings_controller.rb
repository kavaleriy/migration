class HousingsController < ApplicationController
  before_action :set_housing, only: [:show, :edit, :update, :destroy]

  # GET /housings
  # GET /housings.json
  def index
    @housings = Housing.all.where("qty_places > 0 and koatuu_code like '05%'")
  end

  # GET /housings/1
  # GET /housings/1.json
  def show
  end

  # GET /housings/new
  def new
    @housing = Housing.new
  end

  # GET /housings/1/edit
  def edit
  end

  # POST /housings
  # POST /housings.json
  def create
    @housing = Housing.where(:koatuu_code => housing_params[:koatuu_code], :type_id => housing_params[:type_id]).first
    if @housing
      @housing.update(housing_params)
    else
      @housing = Housing.new(housing_params)
    end

    respond_to do |format|
      if @housing.save
        format.html { redirect_to housings_url , notice: 'Housing was successfully created.' }
        format.json { render :show, status: :created, location: @housing }
      else
        format.html { render :new }
        format.json { render json: @housing.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /housings/1
  # PATCH/PUT /housings/1.json
  def update
    respond_to do |format|
      if @housing.update(housing_params)
        format.html { redirect_to housings_url, notice: 'Housing was successfully updated.' }
        format.json { render :show, status: :ok, location: @housing }
      else
        format.html { render :edit }
        format.json { render json: @housing.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /housings/1
  # DELETE /housings/1.json
  def destroy
    @housing.destroy
    respond_to do |format|
      format.html { redirect_to housings_url, notice: 'Housing was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_housing
      @housing = Housing.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def housing_params
      params.require(:housing).permit(:koatuu_code, :type_id, :qty_places, :qty_work, :has_school, :has_kgarden)
    end
end
