class ApiController < ApplicationController
  def get_areas
    @areas = Koatuu.areas_to_json(params[:q])

    respond_to do |format|
      format.json { render json: @areas, status: :ok }
    end
  end

  def get_regions
    @regions = Koatuu.acities_to_json(params[:area], params[:q]) + Koatuu.regions_to_json(params[:area], params[:q])

    respond_to do |format|
      format.json { render json: @regions, status: :ok }
    end
  end

  def get_koatuu_geo
    area = params[:area]

    if area.nil?
      qtt = Housing.grouped_area
    else
      qtt = Housing.grouped_region(area)
    end

    qtt.collect { |row|
      code = row.koatuu_code
      { 
      }
    }

    respond_to do |format|
      format.json { render json: qtt, status: :ok }
    end
  end

end
