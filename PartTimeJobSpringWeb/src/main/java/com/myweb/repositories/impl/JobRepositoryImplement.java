/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.myweb.repositories.impl;

import com.myweb.pojo.Day;
import com.myweb.pojo.DayJob;
import com.myweb.pojo.Job;
import com.myweb.repositories.JobRepository;
import com.myweb.utils.GeneralUtils;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.JoinType;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@Transactional
public class JobRepositoryImplement implements JobRepository {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Map<String, Object> searchJobs(Map<String, String> params) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Job> countRoot = countQuery.from(Job.class);
        countRoot.join("companyId", JoinType.LEFT);
        countQuery.select(cb.count(countRoot)).where(buildPredicates(params, cb, countRoot).toArray(new Predicate[0]));
        Long totalRecords = session.createQuery(countQuery).getSingleResult();

        CriteriaQuery<Job> cq = cb.createQuery(Job.class);
        Root<Job> jobRoot = cq.from(Job.class);
        jobRoot.fetch("companyId", JoinType.LEFT);
        cq.where(buildPredicates(params, cb, jobRoot).toArray(new Predicate[0]));
        cq.orderBy(cb.desc(jobRoot.get("postedDate")));
//        cq.orderBy(cb.asc(jobRoot.get("id")));

        int page = Integer.parseInt(params.getOrDefault("page", GeneralUtils.PAGE));
        int start = (page - 1) * GeneralUtils.PAGE_SIZE;
        List<Job> jobs = session.createQuery(cq)
                .setFirstResult(start)
                .setMaxResults(GeneralUtils.PAGE_SIZE)
                .getResultList();

        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }

        int totalPages = (int) Math.ceil((double) totalRecords / GeneralUtils.PAGE_SIZE);

        Map<String, Object> result = new HashMap<>();
        result.put("jobs", jobs);
        result.put("currentPage", page);
        result.put("pageSize", GeneralUtils.PAGE_SIZE);
        result.put("totalPages", totalPages);
        result.put("totalItems", totalRecords);

        return result;
    }

    private List<Predicate> buildPredicates(Map<String, String> params, CriteriaBuilder cb, Root<Job> jobRoot) {
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(jobRoot.get("isActive"), true));

        if (params != null) {
            // Xác định ngữ cảnh client hay admin
            boolean isClient = "true".equalsIgnoreCase(params.get("isClient"));
            System.out.println("isClient: " + isClient);

            // Áp dụng status = "approved" cho client nếu không có tham số status
            String status = params.get("status");
            if (isClient && (status == null || status.isEmpty())) {
                predicates.add(cb.equal(jobRoot.get("status"), "approved"));
                System.out.println("Added status predicate: status = 'approved'");
            } else if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(jobRoot.get("status"), status));
                System.out.println("Added status predicate: status = " + status);
            }

            // Từ khóa
            String keyword = params.get("keyword");
            if (keyword != null && !keyword.isEmpty()) {
                predicates.add(cb.or(
                        cb.like(cb.lower(jobRoot.get("jobName")), "%" + keyword.toLowerCase() + "%"),
                        cb.like(cb.lower(jobRoot.get("description")), "%" + keyword.toLowerCase() + "%")
                ));
                System.out.println("Added keyword predicate: " + keyword);
            }

            // Ngành nghề
            String majorId = params.get("majorId");
            if (majorId != null && !majorId.isEmpty()) {
                try {
                    predicates.add(cb.equal(jobRoot.join("majorJobCollection").join("majorId").get("id"), Integer.parseInt(majorId)));
                    System.out.println("Added majorId predicate: " + majorId);
                } catch (NumberFormatException e) {
                    System.err.println("Invalid majorId format: " + majorId);
                }
            }

            // Mức lương
            String salaryMin = params.get("minSalary");
            if (salaryMin != null && !salaryMin.isEmpty()) {
                try {
                    predicates.add(cb.greaterThanOrEqualTo(jobRoot.get("salaryMin"), new BigInteger(salaryMin)));
                    System.out.println("Added minSalary predicate: " + salaryMin);
                } catch (NumberFormatException e) {
                    System.err.println("Invalid minSalary format: " + salaryMin);
                }
            }
            String salaryMax = params.get("maxSalary");
            if (salaryMax != null && !salaryMax.isEmpty()) {
                try {
                    predicates.add(cb.lessThanOrEqualTo(jobRoot.get("salaryMax"), new BigInteger(salaryMax)));
                    System.out.println("Added maxSalary predicate: " + salaryMax);
                } catch (NumberFormatException e) {
                    System.err.println("Invalid maxSalary format: " + salaryMax);
                }
            }

            // Thành phố
            String city = params.get("city");
            if (city != null && !city.isEmpty()) {
                city = normalizeLocation(city);
                predicates.add(cb.equal(cb.lower(jobRoot.get("city")), city.toLowerCase()));
                System.out.println("Added city predicate: " + city);
            }

            // Quận/Huyện
            String district = params.get("district");
            if (district != null && !district.isEmpty()) {
                district = normalizeLocation(district);
                predicates.add(cb.equal(cb.lower(jobRoot.get("district")), district.toLowerCase()));
                System.out.println("Added district predicate: " + district);
            }

            // Thời gian làm việc
            String dayId = params.get("dayId");
            if (dayId != null && !dayId.isEmpty()) {
                try {
                    predicates.add(cb.equal(jobRoot.join("dayJobCollection").join("dayId").get("id"), Integer.parseInt(dayId)));
                    System.out.println("Added dayId predicate: " + dayId);
                } catch (NumberFormatException e) {
                    System.err.println("Invalid dayId format: " + dayId);
                }
            }

            // Kinh nghiệm
            String experience = params.get("experience");
            if (experience != null && !experience.isEmpty()) {
                try {
                    predicates.add(cb.greaterThanOrEqualTo(jobRoot.get("experienceRequired"), Integer.parseInt(experience)));
                    System.out.println("Added experience predicate: " + experience);
                } catch (NumberFormatException e) {
                    System.err.println("Invalid experience format: " + experience);
                }
            }

            // Ngày đăng
            String postedDays = params.get("postedDays");
            if (postedDays != null && !postedDays.isEmpty()) {
                try {
                    LocalDateTime cutoffDate = LocalDateTime.now().minusDays(Integer.parseInt(postedDays));
                    predicates.add(cb.greaterThanOrEqualTo(jobRoot.get("postedDate"), Timestamp.valueOf(cutoffDate)));
                    System.out.println("Added postedDays predicate: " + postedDays);
                } catch (NumberFormatException e) {
                    System.err.println("Invalid postedDays format: " + postedDays);
                }
            }

            // Lọc theo khoảng cách dựa trên tọa độ
            String coordinates = params.get("coordinates");
            String distanceStr = params.get("distance");
            if (coordinates != null && !coordinates.isEmpty() && distanceStr != null && !distanceStr.isEmpty()) {
                System.out.println("Coordinates: " + coordinates + ", Distance: " + distanceStr);

                String[] coords = coordinates.split(",");
                if (coords.length != 2) {
                    System.err.println("Invalid coordinates format: " + coordinates);
                    return predicates;
                }

                double userLng, userLat, distanceKm;
                try {
                    userLng = Double.parseDouble(coords[0]);
                    userLat = Double.parseDouble(coords[1]);
                    distanceKm = Double.parseDouble(distanceStr);
                    System.out.println("Parsed - userLng: " + userLng + ", userLat: " + userLat + ", distanceKm: " + distanceKm);
                } catch (NumberFormatException e) {
                    System.err.println("Error parsing coordinates or distance: " + e.getMessage());
                    return predicates;
                }

                // Công thức Haversine
                double earthRadius = 6371.0; // Bán kính Trái Đất (km)
                Expression<Double> latRad = cb.function("radians", Double.class, jobRoot.get("latitude"));
                Expression<Double> lngRad = cb.function("radians", Double.class, jobRoot.get("longitude"));
                Expression<Double> userLatRad = cb.literal(Math.toRadians(userLat));
                Expression<Double> userLngRad = cb.literal(Math.toRadians(userLng));

                Expression<Double> dLat = cb.diff(latRad, userLatRad);
                Expression<Double> dLon = cb.diff(lngRad, userLngRad);

                Expression<Double> a = cb.sum(
                        cb.function("power", Double.class, cb.function("sin", Double.class, cb.quot(dLat, 2)), cb.literal(2.0)),
                        cb.prod(
                                cb.prod(
                                        cb.function("cos", Double.class, userLatRad),
                                        cb.function("cos", Double.class, latRad)
                                ),
                                cb.function("power", Double.class, cb.function("sin", Double.class, cb.quot(dLon, 2)), cb.literal(2.0))
                        )
                );

                Expression<Double> c = cb.prod(
                        cb.literal(2.0),
                        cb.function("atan2", Double.class,
                                cb.function("sqrt", Double.class, a),
                                cb.function("sqrt", Double.class, cb.diff(cb.literal(1.0), a))
                        )
                );

                Expression<Double> distance = cb.prod(cb.literal(earthRadius), c);

                System.out.println("Adding distance predicate: distance <= " + distanceKm);
                predicates.add(cb.le(distance, distanceKm));
                predicates.add(cb.isNotNull(jobRoot.get("latitude")));
                predicates.add(cb.isNotNull(jobRoot.get("longitude")));
                System.out.println("Added predicates: distance <= " + distanceKm + ", latitude not null, longitude not null");
            }
        }

        System.out.println("Final predicates count: " + predicates.size());
        return predicates;
    }

    private String normalizeLocation(String location) {
        String normalized = location.trim()
                .replaceAll("^(Thành phố|Tỉnh)\\s*", "")
                .replaceAll("\\s+", " ");
        return normalized.substring(0, 1).toUpperCase() + normalized.substring(1).toLowerCase();
    }

    @Override
    public List<Job> getListJobByMajor(int majorId) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Job> cq = cb.createQuery(Job.class);
        Root<Job> jobRoot = cq.from(Job.class);

        jobRoot.fetch("companyId", JoinType.LEFT);
        cq.where(
                cb.equal(jobRoot.get("isActive"), true),
                cb.equal(jobRoot.get("status"), GeneralUtils.Status.approved.toString()),
                cb.equal(jobRoot.get("companyId").get("status"), GeneralUtils.Status.pending.toString()),
                cb.equal(jobRoot.join("majorJobCollection").join("majorId").get("id"), majorId)
        );
        cq.orderBy(cb.asc(jobRoot.get("id")));

        List<Job> jobs = session.createQuery(cq).getResultList();

        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }

        return jobs;
    }

    @Override
    public Job getJobById(int jobId) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Job> cq = cb.createQuery(Job.class);
        Root<Job> jobRoot = cq.from(Job.class);

        jobRoot.fetch("companyId", JoinType.LEFT);
        cq.where(
                cb.equal(jobRoot.get("id"), jobId),
                cb.equal(jobRoot.get("isActive"), true),
                cb.equal(jobRoot.get("status"), GeneralUtils.Status.approved.toString()),
                cb.equal(jobRoot.get("companyId").get("status"), GeneralUtils.Status.approved.toString())
        );

        Job job = session.createQuery(cq).uniqueResult();

//        Hibernate.initialize(job.getMajorJobCollection());
//        Hibernate.initialize(job.getDayJobCollection());
        return job;
    }

    @Override
    public List<Job> getListJobByRecommend(int majorId, int cityId) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Job> cq = cb.createQuery(Job.class);
        Root<Job> jobRoot = cq.from(Job.class);

        jobRoot.fetch("companyId", JoinType.LEFT);
        cq.where(
                cb.equal(jobRoot.get("isActive"), true),
                cb.equal(jobRoot.get("status"), GeneralUtils.Status.approved.toString()),
                cb.equal(jobRoot.get("companyId").get("status"), GeneralUtils.Status.approved.toString()),
                cb.equal(jobRoot.join("majorJobCollection").join("majorId").get("id"), majorId),
                cb.equal(jobRoot.get("city"), String.valueOf(cityId))
        );
        cq.orderBy(cb.asc(jobRoot.get("id")));

        List<Job> jobs = session.createQuery(cq).getResultList();

        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }

        return jobs;
    }

    @Override
    public List<Job> getListJobByCompanyId(int companyId) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Job> cq = cb.createQuery(Job.class);
        Root<Job> jobRoot = cq.from(Job.class);

        jobRoot.fetch("companyId", JoinType.LEFT);
        cq.where(
                cb.equal(jobRoot.get("companyId").get("id"), companyId),
                cb.equal(jobRoot.get("isActive"), true),
                cb.equal(jobRoot.get("status"), GeneralUtils.Status.approved.toString()),
                cb.equal(jobRoot.get("companyId").get("status"), GeneralUtils.Status.approved.toString())
        );
        cq.orderBy(cb.asc(jobRoot.get("id")));

        List<Job> jobs = session.createQuery(cq).getResultList();

        for (Job job : jobs) {
            Hibernate.initialize(job.getMajorJobCollection());
            Hibernate.initialize(job.getDayJobCollection());
        }

        return jobs;
    }

    @Override
    public List<Job> getListJobByCompanyExceptCurrentJob(int companyId, int jobId) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Job getNameJob(int jobId) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public List<Job> getListJobByCandidate(int candidateId) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public List<Job> getListJobByCheckAdmin() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public List<Job> getListJobByMajorAndCity(int majorId, String city, String kw) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public List<Job> getListJobForManageCompany(int companyId) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void updateJob(int jobId) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public List<Job> getListJobByCityKw(String city, String kw) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public List<Job> getListJobByCityKwPage(String city, String kw, int page) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Long countJob() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void deleteJob(int jobId) {
        Session session = sessionFactory.getCurrentSession();
        session.remove(session.get(Job.class, jobId));
        session.flush();
    }

    @Override
    public List<Job> getListJobForManage() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Job> q = cb.createQuery(Job.class);
        Root<Job> root = q.from(Job.class);

        q.where(
                cb.equal(root.get("isActive"), true),
                cb.equal(root.get("status"), GeneralUtils.Status.approved.toString()),
                cb.equal(root.get("companyId").get("status"), GeneralUtils.Status.approved.toString())
        );
        q.orderBy(cb.asc(root.get("id")));

        return session.createQuery(q).getResultList();
    }

    @Override
    public Job addJob(Job j) {
        Session session = sessionFactory.getCurrentSession();
        Job mergedJob = (Job) session.merge(j);
        session.flush();
        return mergedJob;
    }

    @Override
    public void addDaysToJob(Job job, List<Integer> dayIds) {
        Session session = sessionFactory.getCurrentSession();
        session.createMutationQuery("DELETE FROM DayJob dj WHERE dj.jobId.id = :jobId")
                .setParameter("jobId", job.getId())
                .executeUpdate();

        List<Day> days = session.createQuery("FROM Day", Day.class).getResultList();
        for (Integer dayId : dayIds) {
            Day day = days.stream().filter(d -> d.getId().equals(dayId)).findFirst().get();
            DayJob dayJob = new DayJob();
            dayJob.setJobId(job);
            dayJob.setDayId(day);
            session.persist(dayJob);
        }
        session.flush();
    }

    @Override
    public Job getOnlyJobById(int id) {
        Session session = sessionFactory.getCurrentSession();
        Job job = session.get(Job.class, id);
        Hibernate.initialize(job.getMajorJobCollection());
        Hibernate.initialize(job.getDayJobCollection());
        return job;
    }

    @Override
    public List<Job> getJobByAuthenticateCompany(int companyId) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Job> cq = cb.createQuery(Job.class);
        Root<Job> jobRoot = cq.from(Job.class);

        jobRoot.fetch("companyId", JoinType.LEFT);
        cq.where(
                cb.equal(jobRoot.get("companyId").get("id"), companyId),
                cb.equal(jobRoot.get("isActive"), true)
        );
        cq.orderBy(cb.asc(jobRoot.get("id")));

        return session.createQuery(cq).getResultList();
    }

    @Override
    public Job addOrUpdateJob(Job job) {
        Session session = sessionFactory.getCurrentSession();
        Job mergedJob = (Job) session.merge(job);
        session.flush();
        return mergedJob;
    }

    @Override
    public void deleteMajorJobsByJobId(int jobId) {
        Session session = sessionFactory.getCurrentSession();
        session.createMutationQuery("DELETE FROM MajorJob mj WHERE mj.jobId.id = :jobId")
                .setParameter("jobId", jobId)
                .executeUpdate();
        session.flush();
    }

    @Override
    public void deleteDayJobsByJobId(int jobId) {
        Session session = sessionFactory.getCurrentSession();
        session.createMutationQuery("DELETE FROM DayJob dj WHERE dj.jobId.id = :jobId")
                .setParameter("jobId", jobId)
                .executeUpdate();
        session.flush();
    }

    @Override
    public Map<String, Object> getCompanyJobs(int companyId, Map<String, String> params) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();

        // Count total records
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Job> countRoot = countQuery.from(Job.class);
        countQuery.select(cb.count(countRoot)).where(buildCompanyPredicates(companyId, params, cb, countRoot).toArray(new Predicate[0]));
        Long totalRecords = session.createQuery(countQuery).getSingleResult();

        // Fetch jobs with pagination
        CriteriaQuery<Job> cq = cb.createQuery(Job.class);
        Root<Job> jobRoot = cq.from(Job.class);
        jobRoot.fetch("companyId", JoinType.LEFT);
        cq.where(buildCompanyPredicates(companyId, params, cb, jobRoot).toArray(new Predicate[0]));

        // Sorting by postedDate
        String sort = params.getOrDefault("sort", "desc");
        if (sort.equalsIgnoreCase("asc")) {
            cq.orderBy(cb.asc(jobRoot.get("postedDate")));
        } else {
            cq.orderBy(cb.desc(jobRoot.get("postedDate")));
        }

        int page = Integer.parseInt(params.getOrDefault("page", "1"));
        int start = (page - 1) * GeneralUtils.PAGE_SIZE;
        List<Job> jobs = session.createQuery(cq)
                .setFirstResult(start)
                .setMaxResults(GeneralUtils.PAGE_SIZE)
                .getResultList();

        int totalPages = (int) Math.ceil((double) totalRecords / GeneralUtils.PAGE_SIZE);

        Map<String, Object> result = new HashMap<>();
        result.put("jobs", jobs);
        result.put("currentPage", page);
        result.put("pageSize", GeneralUtils.PAGE_SIZE);
        result.put("totalPages", totalPages);
        result.put("totalItems", totalRecords);

        return result;
    }

    private List<Predicate> buildCompanyPredicates(int companyId, Map<String, String> params, CriteriaBuilder cb, Root<Job> jobRoot) {
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(cb.equal(jobRoot.get("companyId").get("id"), companyId));
        predicates.add(cb.equal(jobRoot.get("isActive"), true));

        String status = params.get("status");
        if (status != null && !status.isEmpty()) {
            predicates.add(cb.equal(jobRoot.get("status"), status));
        }

        String keyword = params.get("keyword");
        if (keyword != null && !keyword.isEmpty()) {
            predicates.add(cb.like(cb.lower(jobRoot.get("jobName")), "%" + keyword.toLowerCase() + "%"));
        }

        return predicates;
    }
}
