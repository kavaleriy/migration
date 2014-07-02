class ApiController < ApplicationController
  def get_koatuu
    koatuu = Koatuu.coatuu_to_json(params[:q].ljust(10, '0'))

    respond_to do |format|
      format.json { render json: [{ id: koatuu[:id], name: koatuu[:name] }], status: :ok }
    end
  end

  def get_areas
    areas = Koatuu.areas_to_json(params[:q])

    respond_to do |format|
      format.json { render json: areas, status: :ok }
    end
  end

  def get_regions
    regions = Koatuu.acities_to_json(params[:area], params[:q]) + Koatuu.regions_to_json(params[:area], params[:q])

    respond_to do |format|
      format.json { render json: regions, status: :ok }
    end
  end

  def get_koatuu_geo

    area = params[:area]

    if area
      qtt = (Koatuu.acities(area) + Koatuu.regions(area)).collect { |region|
        code = region.code.slice(0, 5)
        { code: code, area: area, region: region.code, name: region.name, qtt: Housing.group_qtt(code)}
      }
    else
      qtt = Koatuu.areas.collect { |area|
        code = area.code.slice(0, 2)
        { code: code, area: area.code, name: area.name, qtt: Housing.group_qtt(code)}
      }
    end

    qtt = qtt.reject {|v| v[:qtt] == 0 }
    qtt.map { |row|
      geo = Geo.where(:koatuu_code => row[:code]).first
      row[:geo] = { lon: geo.lon, lat: geo.lat, zoom: geo.zoom } if geo
    }

    render json: qtt, status: :ok
  end

end
