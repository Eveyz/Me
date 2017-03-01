namespace :database_setup do
  desc "TODO"
  task create_personnels: :environment do
    personnel_names = Personnel::NAMES
    personnel_names.each do |pn|
      Personnel.create!(name: "#{pn}", email: "#{pn}@gmail.com", phone: "859-213-#{rand.to_s[2..5]}")
    end
    p "Create personnel done!"
  end

  task create_companies: :environment do
    companies = Company::COMPANIES
    companies.each do |company|
      Company.create!(name: "#{company}")
    end
    p "Create companies done!"
  end

  task create_cases: :environment do
    companies = Company::COMPANIES
    personnel_names = Personnel::NAMES

    # @personnels = Personnel.all
    # empty = true
    # if @personnels.present?
    #   empty = false
    # end
    i = 0
    cases = Case.all

    while cases.size < 31
      # create case time

      # if empty
      #   personnel = Personnel.find(name: "marek")
      #   c1 = "Acme"
      #   c2 = "Shark"
      # else
      #   personnel = Personnel.find()
      # end
      c1 = companies[i]
      companies.each do |c|
        if c != c1
          start_time = 1.year.ago
          week_number = rand(1..9)
          completion = start_time + (week_number*7*24*60*60)

          condition = true

          while condition
            personnel_name = personnel_names.sample
            personnel_id = Personnel.find_by(name: personnel_name).id
            old_case = Case.find_by(personnel_id: personnel_id, c1: c)
            unless old_case.present? or personnel_name == "ipo"
              condition = false
            end
          end

          c2 = c
          Case.create!(personnel_id: personnel_id, start: start_time, completion: completion, c1: c1, c2: c2)
          i = i + 1
        end
      end

      # i = i + 1
      cases = Case.all
    end
    p "Create cases done!"
  end

  task create_documents: :environment do
    documents = Document::DOCUMENTS
    greek_size = documents.size
    cases = Case.all
    iteration = 1
    index = 0
    # cases = Case.all
    if cases.present?
      cases.each do |cas|
        if index >= greek_size
          index = index - greek_size - 1
        end
        documents_name = documents[index] + cas.id.to_s
        p documents_name
        p cas.c1
        Document.create!(name: documents_name, company: cas.c1, case_id: cas.id)
        index += 1
      end
    end
    p "Create documents done!"
  end

end
