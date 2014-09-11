json.array!(@advert_works) do |advert_work|
  json.extract! advert_work, :id, :koatuu_code, :email, :fio, :phone, :note, :rubric, :places, :salary
  json.url advert_work_url(advert_work, format: :json)
end
