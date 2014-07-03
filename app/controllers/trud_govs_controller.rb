class TrudGovsController < ApplicationController
  before_filter :authenticate_user!
  before_action :set_trud_gov, only: [:show, :edit, :update, :destroy]

  # GET /trud_govs
  # GET /trud_govs.json
  def index
    koatuu_code = params[:q]
    if koatuu_code.nil? or koatuu_code.empty?
      @trud_govs = TrudGov.all.paginate(:page => params[:page])
      params[:q] = nil
    else
      @trud_govs = TrudGov.filter_by_koatuu(koatuu_code.slice(0,2))
    end

    render partial: 'table.html' unless koatuu_code.nil?
  end

  # GET /trud_govs/1
  # GET /trud_govs/1.json
  def show
  end

  # GET /trud_govs/new
  def new
    @trud_gov = TrudGov.new
  end

  # GET /trud_govs/1/edit
  def edit
  end

  # POST /trud_govs
  # POST /trud_govs.json
  def create
    @trud_gov = TrudGov.new(trud_gov_params)

    respond_to do |format|
      if @trud_gov.save
        format.html { redirect_to @trud_gov, notice: 'Trud gov was successfully created.' }
        format.json { render :show, status: :created, location: @trud_gov }
      else
        format.html { render :new }
        format.json { render json: @trud_gov.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /trud_govs/1
  # PATCH/PUT /trud_govs/1.json
  def update
    respond_to do |format|
      if @trud_gov.update(trud_gov_params)
        format.html { redirect_to @trud_gov, notice: 'Trud gov was successfully updated.' }
        format.json { render :show, status: :ok, location: @trud_gov }
      else
        format.html { render :edit }
        format.json { render json: @trud_gov.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /trud_govs/1
  # DELETE /trud_govs/1.json
  def destroy
    @trud_gov.destroy
    respond_to do |format|
      format.html { redirect_to trud_govs_url, notice: 'Trud gov was successfully destroyed.' }
      format.json { head :no_content }
    end
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_trud_gov
      @trud_gov = TrudGov.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def trud_gov_params
      params.require(:trud_gov).permit(:trud_code, :koatuu_code)
    end
end
