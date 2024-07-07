
let allLikeButton = document.querySelectorAll('.like-btn');

async function likeButton(eventId, btn) {
    try {
        let response = await axios({
            method: 'post',
            url: `/events/${eventId}/like`,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        // Toggle the icon class and color
        let heart = btn.querySelector('i');
        if (response.data.success) {
            if (response.data.liked) {
                heart.classList.remove('fa-regular');
                heart.classList.add('fa-solid');
                heart.style.color = '#ff1f1f';
            } else {
                heart.classList.remove('fa-solid');
                heart.classList.add('fa-regular');
                heart.style.color = '';
            }
        } else {
            console.log('Failed to toggle like:', response.data.message);
        }

    } catch (error) {
        if (error.response && error.response.status === 401) {
            window.location.replace('/login');
        } else {
            console.error("Error liking the event:", error.message);
        }
    }
}

for (let btn of allLikeButton) {
    btn.addEventListener('click', () => {
        let eventId = btn.getAttribute('event-id');
        likeButton(eventId, btn);
    });
}
