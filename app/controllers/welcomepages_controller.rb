class WelcomepagesController < ApplicationController

  def legaloffice
    @cases = Case.all
  end

  def new_case
    @cases = Case.all
    @company_list = Company.all.pluck(:name)
    @personnels = Personnel.where.not(name: "ipo").pluck(:name)
    @c1 = Case.all.pluck(:c1)
    @c2 = Case.all.pluck(:c2)
  end

  def create_case
    @qualify = true
    @duplicated = false
    @c1 = params[:defending]
    @c2 = params[:adversary]
    @personnel_id = Personnel.find_by_name(params[:personnel]).id
    @duplicated_cases = Case.where(c1: @c1, c2: @c2)
    @conflict_cases = Case.where(personnel_id: @personnel_id, c1: @c2)
    p @conflict_cases
    if @duplicated_cases.present?
      @duplicated = true
      @case_personnel = Personnel.find(@duplicated_cases.first.personnel_id).name
    else
      if @conflict_cases.present?
        @qualify = false
      end
    end
    if @qualify
      Case.create!(personnel_id: @personnel_id, start: Time.now, c1: @c1, c2: @c2)
    end
    response = { qualify: @qualify, conflict_cases: @conflict_cases, duplicated_cases: @duplicated_cases, case_personnel: @case_personnel }
    render json: response, status: :ok
  end

  def assign_case

  end

  def check_document
    @documents = Document.all.pluck(:name)
    @personnels = Personnel.where.not(name: "ipo").pluck(:name)
  end

  def check_document_qualification
    @qualify = true
    document = params[:document]
    personnel = params[:personnel]
    # document_case_id = Document.find_by(name: document).case_id
    company_name = Document.find_by(name: document).company
    personnel_id = Personnel.find_by(name: personnel).id
    @cases = Case.where('completion IS NULL AND personnel_id = ?', personnel_id)
    @conflict_cases = []
    if @cases.present?
      @cases.each do |ca|
        if ca.c2 == company_name
          @qualify = false
          @conflict_cases << ca
          Contact.create!(sender: personnel, receiver: document, contact_type: 'document', legal: @qualify)
        end
      end
    end
    response = { qualify: @qualify, conflict_cases: @conflict_cases, company_name: company_name }
    render json: response, status: :ok
  end

  def ipo
    @legal_contacts = Contact.where(legal: true).order('created_at DESC')
    @illegal_contacts = Contact.where(legal: false, contact_type: 'contact').order('created_at DESC')
    @illegal_check = Contact.where(legal: false, contact_type: 'document').order('created_at DESC')
  end

  def send_message

  end

  def check_qualification

  end

  def check_contact_qualification
    @qualify = true
    sender = params[:sender]
    receiver = params[:receiver]
    sender_id = Personnel.find_by(name: sender).id
    receiver_id = Personnel.find_by(name: receiver).id
    @cases1 = Case.where('completion IS NULL AND personnel_id = ?', sender_id)
    @cases2 = Case.where('completion IS NULL AND personnel_id = ?', receiver_id)
    @cases = @cases1 + @cases2
    p @cases
    # p @cases.first.id
    @match_case = []
    @conflict_cases1 = []
    @conflict_cases2 = []
    if @cases.present?
      @cases.each do |ca|
        @ccases1 = Case.where("c1 = ? AND personnel_id = ?", ca.c2, receiver_id)
        @ccases2 = Case.where("c1 = ? AND personnel_id = ?", ca.c2, sender_id)
        if @ccases1.present? or @ccases2.present?
          @match_case << ca
          @conflict_cases1 += @ccases1
          @conflict_cases2 += @ccases2
          @conflict_name1 = Personnel.find(@match_case.first.personnel_id).name
          @conflict_name2 = Personnel.find((@conflict_cases1 + @conflict_cases2).first.personnel_id).name
        end
      end
      if @conflict_cases1.present? or @conflict_cases2.present?
        @qualify = false
        Contact.create!(sender: sender, receiver: receiver, contact_type: 'contact', legal: @qualify)
      end
      p @qualify
    end
    response = { qualify: @qualify, match_case: @match_case, conflict_cases1: @conflict_cases1, conflict_cases2: @conflict_cases2, conflict_name1: @conflict_name1, conflict_name2: @conflict_name2 }
    render json: response, status: :ok
  end

  def contact
    @contact_list = Personnel.where.not(name: "ipo").pluck(:name)
  end

end
