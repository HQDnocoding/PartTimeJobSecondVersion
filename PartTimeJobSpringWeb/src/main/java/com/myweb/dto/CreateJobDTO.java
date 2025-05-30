package com.myweb.dto;

import com.myweb.dto.CreateJobDTO.SalaryRange;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.math.BigInteger;
import java.util.List;

public class CreateJobDTO {

    @NotBlank(message = "Tên công việc không được để trống")
    private String jobName;

    @NotNull(message = "Công ty không được để trống")
    private Integer companyId;

    @NotNull(message = "Lương tối thiểu không được để trống")
    @Positive(message = "Lương tối thiểu phải là số dương")
    private BigInteger salaryMin;

    @NotNull(message = "Lương tối đa không được để trống")
    @Positive(message = "Lương tối đa phải là số dương")
    private BigInteger salaryMax;

    @NotNull(message = "Ngành nghề không được để trống")
    private Integer majorId;

    @NotEmpty(message = "Phải chọn ít nhất một thời gian làm việc")
    private List<Integer> dayIds;

    @NotBlank(message = "Mô tả công việc không được để trống")
    private String description;

    @NotBlank(message = "Yêu cầu công việc không được để trống")
    private String jobRequired;

    @LongitudeRange
    private Double longitude;

    @LatitudeRange
    private Double latitude;

    private Integer ageFrom;
    private Integer ageTo;
    private Integer experienceRequired;

    @NotBlank(message = "Địa chỉ đầy đủ không được để trống")
    private String fullAddress;
    
    @NotBlank(message = "Thành phố không được để trống")
    private String city;
    
    @NotBlank(message = "Quận/Huyện không được để trống")
    private String district;

    // Custom validation annotation for salary range
    @Target({ElementType.TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    @Constraint(validatedBy = SalaryRangeValidator.class)
    @interface SalaryRange {
        String message() default "Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    static class SalaryRangeValidator implements ConstraintValidator<SalaryRange, CreateJobDTO> {
        @Override
        public boolean isValid(CreateJobDTO dto, ConstraintValidatorContext context) {
            if (dto.getSalaryMin() == null || dto.getSalaryMax() == null) {
                return true; // Let @NotNull handle null cases
            }
            return dto.getSalaryMax().compareTo(dto.getSalaryMin()) >= 0;
        }
    }

    // Custom validation for longitude
    @Target({ElementType.FIELD})
    @Retention(RetentionPolicy.RUNTIME)
    @Constraint(validatedBy = LongitudeRangeValidator.class)
    @interface LongitudeRange {
        String message() default "Kinh độ phải từ -180 đến 180";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    static class LongitudeRangeValidator implements ConstraintValidator<LongitudeRange, Double> {
        @Override
        public boolean isValid(Double value, ConstraintValidatorContext context) {
            if (value == null) {
                return true; // Optional now
            }
            return value >= -180 && value <= 180;
        }
    }

    // Custom validation for latitude
    @Target({ElementType.FIELD})
    @Retention(RetentionPolicy.RUNTIME)
    @Constraint(validatedBy = LatitudeRangeValidator.class)
    @interface LatitudeRange {
        String message() default "Vĩ độ phải từ -90 đến 90";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    static class LatitudeRangeValidator implements ConstraintValidator<LatitudeRange, Double> {
        @Override
        public boolean isValid(Double value, ConstraintValidatorContext context) {
            if (value == null) {
                return true; // Optional now
            }
            return value >= -90 && value <= 90;
        }
    }

    // Getters and Setters
    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public Integer getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Integer companyId) {
        this.companyId = companyId;
    }

    public BigInteger getSalaryMin() {
        return salaryMin;
    }

    public void setSalaryMin(BigInteger salaryMin) {
        this.salaryMin = salaryMin;
    }

    public BigInteger getSalaryMax() {
        return salaryMax;
    }

    public void setSalaryMax(BigInteger salaryMax) {
        this.salaryMax = salaryMax;
    }

    public Integer getMajorId() {
        return majorId;
    }

    public void setMajorId(Integer majorId) {
        this.majorId = majorId;
    }

    public List<Integer> getDayIds() {
        return dayIds;
    }

    public void setDayIds(List<Integer> dayIds) {
        this.dayIds = dayIds;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getJobRequired() {
        return jobRequired;
    }

    public void setJobRequired(String jobRequired) {
        this.jobRequired = jobRequired;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public String getFullAddress() {
        return fullAddress;
    }

    public void setFullAddress(String fullAddress) {
        this.fullAddress = fullAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public Integer getAgeFrom() {
        return ageFrom;
    }

    public void setAgeFrom(Integer ageFrom) {
        this.ageFrom = ageFrom;
    }

    public Integer getAgeTo() {
        return ageTo;
    }

    public void setAgeTo(Integer ageTo) {
        this.ageTo = ageTo;
    }

    public Integer getExperienceRequired() {
        return experienceRequired;
    }

    public void setExperienceRequired(Integer experienceRequired) {
        this.experienceRequired = experienceRequired;
    }
}