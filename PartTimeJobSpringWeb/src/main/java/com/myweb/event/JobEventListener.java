package com.myweb.event;

import com.myweb.pojo.Follow;
import com.myweb.pojo.Job;
import com.myweb.services.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@Component
public class JobEventListener {

    private static final Logger logger = Logger.getLogger(JobEventListener.class.getName());

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private FollowService followService;

    @Value("${app.job.detail.url:http://your-domain.com/job/}")
    private String jobDetailUrl;

    @Async
    @EventListener
    public void handleJobCreatedEvent(JobCreatedEvent event) {
        Job job = event.getJob();
        List<Follow> followers = followService.getFollowers(job.getCompanyId().getId());

        logger.log(Level.INFO, "Processing JobCreatedEvent for job ID: {0}, company ID: {1}", new Object[]{job.getId(), job.getCompanyId().getId()});

        for (Follow follow : followers) {
            if (follow.getIsActive() && follow.getIsCandidateFollowed()) {
                try {
                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                    helper.setTo(follow.getCandidateId().getUserId().getUsername());
                    helper.setSubject("Tin tuyển dụng mới từ " + job.getCompanyId().getName());
                    helper.setText(
                            "<h3>Tin tuyển dụng mới!</h3>"
                            + "<p>Công ty <strong>" + job.getCompanyId().getName() + "</strong> vừa đăng tuyển vị trí: <strong>" + job.getJobName() + "</strong>.</p>"
                            + "<p><a href='" + jobDetailUrl + job.getId() + "'>Xem chi tiết</a></p>",
                            true
                    );
                    mailSender.send(message);
                    logger.log(Level.INFO, "Email sent to: {0}", follow.getCandidateId().getUserId().getUsername());
                } catch (MessagingException e) {
                    logger.log(Level.SEVERE, "Failed to send email to: {0}, error: {1}", new Object[]{follow.getCandidateId().getUserId().getUsername(), e.getMessage()});
                }
            } else {
                logger.log(Level.INFO, "Skipping email for candidate ID: {0} (isActive={1}, isCandidateFollowed={2})", new Object[]{follow.getCandidateId().getId(), follow.getIsActive(), follow.getIsCandidateFollowed()});
            }
        }
    }
}
