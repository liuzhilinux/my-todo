import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.Scanner;

/**
 * Ｔｏｄｏ 类。
 */
public class Todo {

    /**
     * 文字提示 Tips 。
     */
    private final String NO_CONTENT_ERR = "请填写任务内容。";
    private final String TASK_NO_EXIST_ERR = "任务不存在。";
    private final String NUM_ERR = "清输入合法的任务序号。";
    private final String STEP_ERR = "清输入合法的移动步数。";
    private final String ORIGIN_CONTENT_IS = "原内容是：";
    private final String PLEASE_INPUT_CONTENT = "请输入要修改的内容：";
    private final String YOUR_VERB_IS = "你的动作是： ";
    private final String I_DONT_KNOW_WHAT_YOUR_WANT = "我不知道你想干什么~";
    private final String ARE_YOU_SURE_CLEAR_ALL = "确认清空所有任务吗？[N/y]";

    /**
     * 数据库文件。
     */
    private String dbPath;

    /**
     * 动作。
     */
    private String verb = null;

    /**
     * 任务序号。
     */
    private int n = -1;

    /**
     * 任务内容。
     */
    private String content = null;

    /**
     * 移动步数。
     */
    private int n1 = -1;

    /**
     * 要修改成的任务内容。
     */
    private String content1 = null;

    /**
     * 任务列表。
     */
    private ArrayList<Task> list;

    /**
     * 任务类型。
     */
    private class Task {
        /**
         * 任务内容。
         */
        private String content;

        /**
         * 任务是否完成的状态标记。
         */
        private boolean status;

        /**
         * 初始化一个任务。
         * 
         * @param content 任务内容。
         * @param status  任务状态，true 为已完成， false 为未完成。
         */
        private Task(String content, boolean status) {
            this.content = content;
            this.status = status;
        }

        /**
         * 将任务对象转成 JSON 格式。
         */
        public String toString() {
            String str = "{\"content\":\"" + this.content + "\",\"status\":" + (this.status ? "true" : "false") + "}";

            return str;
        }
    }

    /**
     * 主函数。
     * 
     * @param args 命令行参数。
     */
    public static void main(String[] args) {
        Todo todo = new Todo(args);
        String verb = todo.verb;
        boolean noAction = false;

        todo.init();

        int n = todo.n;
        String content = todo.content;
        int n1 = todo.n1;
        String content1 = todo.content1;
        ArrayList<Task> list = todo.list;

        switch (verb) {
        case "add":
            todo.add(content, list);
            break;
        case "list":
            break;
        case "done":
            todo.done(n, list);
            break;
        case "delete":
            todo.delete(n, list);
            break;
        case "edit":
            todo.edit(n, content1, list);
            break;
        case "undone":
            todo.undone(n, list);
            break;
        case "moveup":
            todo.moveup(n, n1, list);
            break;
        case "movedown":
            todo.movedown(n, n1, list);
            break;
        case "clearall":
            todo.clearall(list);
            break;
        default:
            noAction = true;
            System.out.println(todo.YOUR_VERB_IS + verb);
            System.out.println(todo.I_DONT_KNOW_WHAT_YOUR_WANT);
            break;
        }

        if (!verb.equals("clearall")) {
            todo.display();
        }

        if (!noAction && !verb.equals("list")) {
            todo.save();
        }
    }

    /**
     * 构造器，初始化输入参数。
     * 
     * @param args 命令行参数。
     */
    private Todo(String[] args) {
        String dir = this.getClass().getResource("").getPath();
        this.dbPath = dir + "db";

        for (int i = 0; i < args.length; i++) {
            switch (i) {
            case 0:
                this.verb = args[i];
                break;
            case 1:
                try {
                    this.n = Integer.parseInt(args[i]) - 1;
                } catch (NumberFormatException e) {
                    // ...
                }
                this.content = args[i];
                break;
            case 2:
                try {
                    this.n1 = Integer.parseInt(args[i]);
                } catch (NumberFormatException e) {
                    // ...
                }
                this.content1 = args[i];
                break;
            }
        }
    }

    /**
     * 初始化，获取数据库数据。
     */
    private void init() {
        String dbPath = this.dbPath;
        File dbFile = new File(this.dbPath);
        String json = null;

        if (!dbFile.exists()) {
            try {
                dbFile.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        try {
            StringBuffer sb = new StringBuffer();
            FileInputStream fis = new FileInputStream(dbPath);
            InputStreamReader isr = new InputStreamReader(fis, "UTF-8");
            BufferedReader reader = new BufferedReader(isr);

            String line = null;
            while ((line = reader.readLine()) != null) {
                sb.append(line + "\n");
            }

            json = sb.toString();

            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        json = json.trim();

        if (json.equals("[]")) {
            this.list = new ArrayList<Task>(10);
        } else {
            json = json.trim().substring(13, json.length() - 3);
            String[] list = json.split("},[{]\"content\":\"");
            this.list = new ArrayList<Task>(list.length + 10);

            for (String item : list) {
                String[] tmp = item.split("\",\"status\":");
                Task task = new Task(tmp[0], tmp[1].equals("true"));
                this.list.add(task);
            }
        }
    }

    /**
     * 保存数据到数据库。
     */
    private void save() {
        String dbPath = this.dbPath;

        Task[] list = new Task[this.list.size()];
        this.list.toArray(list);

        StringBuffer sb = new StringBuffer();

        sb.append("[");

        for (int i = 0; i < list.length; i++) {
            sb.append(list[i]);

            if (i < list.length - 1) {
                sb.append(",");
            }
        }

        sb.append("]");

        try {
            String json = sb.toString();
            FileOutputStream fos = new FileOutputStream(dbPath);
            OutputStreamWriter osw = new OutputStreamWriter(fos, "UTF-8");
            BufferedWriter writer = new BufferedWriter(osw);

            writer.write(json);
            writer.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 显示任务列表。
     */
    private void display() {
        System.out.println();
        Task[] list = new Task[this.list.size()];
        this.list.toArray(list);

        int listLen = list.length;
        String listLenStr = "" + listLen;
        int idxLen = listLenStr.length();
        StringBuffer sb = new StringBuffer();

        for (int i = 0; i < listLen; i++) {
            int idx = i + 1;
            String idxStr = "" + idx;

            for (int j = 0; j < idxLen - idxStr.length(); j++) {
                sb.append(" ");
            }

            sb.append(idxStr);
            sb.append(". ");
            Task task = list[i];
            sb.append(task.status ? "[x] " : "[_] ");
            sb.append(task.content);

            if (i < listLen - 1) {
                sb.append("\n");
            }
        }

        System.err.println(sb);
    }

    /**
     * 添加任务。
     * 
     * @param content 任务内容。
     * @param list    任务列表。
     */
    private void add(String content, ArrayList<Task> list) {
        if (this.checkContent(content)) {
            Task task = new Task(content, false);
            list.add(task);
        }
    }

    /**
     * 标记任务为完成。
     * 
     * @param n    要标记的任务序号。
     * @param list 任务列表。
     */
    private void done(int n, ArrayList<Task> list) {
        if (this.checkNum(n)) {
            Task task = list.get(n);
            task.status = true;
        }
    }

    /**
     * 标记任务为未完成。
     * 
     * @param n    要表计的任务序号。
     * @param list 任务列表。
     */
    private void undone(int n, ArrayList<Task> list) {
        if (this.checkNum(n)) {
            Task task = list.get(n);
            task.status = false;
        }
    }

    /**
     * 删除任务。
     * 
     * @param n    要删除的任务序号。
     * @param list 任务列表。
     */
    private void delete(int n, ArrayList<Task> list) {
        if (this.checkNum(n) && this.checkTaskExist(n, list)) {
            list.remove(n);
        }
    }

    /**
     * 编辑任务内容，如果命令行参数里面没有带任务内容，则后续过程中询问内容。
     * 
     * @param n       要编辑的任务序号。
     * @param content 命令行参数中获取到的任务内容。
     * @param list    任务列表。
     */
    private void edit(int n, String content, ArrayList<Task> list) {
        if (this.checkNum(n) && this.checkTaskExist(n, list)) {
            Task task = list.get(n);

            if (content != null && content.length() > 0) {
                task.content = content;
            } else {
                Scanner scanner = new Scanner(System.in);
                String line;

                System.out.println(this.ORIGIN_CONTENT_IS + task.content);

                try {
                    do {
                        System.out.print(this.PLEASE_INPUT_CONTENT);
                        line = scanner.nextLine();
                        line.trim();
                    } while (line == null || line.length() <= 0);

                    task.content = line;
                } catch (NoSuchElementException e) {
                    // ...
                } catch (IllegalStateException e) {
                    // ...
                }

                scanner.close();
            }
        }
    }

    /**
     * 向上移动任务。
     * 
     * @param n    要向上移动的任务序号。
     * @param n1   要移动的步数。
     * @param list 任务列表。
     */
    private void moveup(int n, int n1, ArrayList<Task> list) {
        if (this.checkNum(n) && this.checkStep(n1) && this.checkTaskExist(n, list)) {
            int idx = n - n1;
            idx = idx < 0 ? 0 : idx;
            Task task = list.get(n);
            Task task2 = list.get(idx);
            list.set(idx, task);
            list.set(n, task2);
        }
    }

    /**
     * 向下移动任务。
     * 
     * @param n    要向下移动的任务序号。
     * @param n1   要移动的步数。
     * @param list 任务列表。
     */
    private void movedown(int n, int n1, ArrayList<Task> list) {
        if (this.checkNum(n) && this.checkStep(n1) && this.checkTaskExist(n, list)) {
            int idx = n + n1;
            idx = idx > list.size() ? list.size() : idx;
            Task task = list.get(n);
            Task task2 = list.get(idx);
            list.set(idx, task);
            list.set(n, task2);
        }
    }

    /**
     * 清除所有任务。
     * 
     * @param list 任务列表。
     */
    private void clearall(ArrayList<Task> list) {
        Scanner scanner = new Scanner(System.in);
        String line;

        try {
            do {
                System.out.print(this.ARE_YOU_SURE_CLEAR_ALL);
                line = scanner.nextLine();
                line.trim();
            } while (line == null || line.length() <= 0);

            line.toLowerCase();

            if (line.equals("n") || line.equals("no")) {
                // Do noting.
            } else if (line.equals("y") || line.equals("yes")) {
                list.clear();
            }

        } catch (NoSuchElementException e) {
            // ...
        } catch (IllegalStateException e) {
            // ...
        }

        scanner.close();
    }

    /* ================ 验证方法 ================ */

    /**
     * 检查任务内容是否填写。
     * 
     * @param content 任务内容。
     * @return true
     */
    private boolean checkContent(String content) {
        if (content == null || content.length() <= 0) {
            System.out.println(this.NO_CONTENT_ERR);
            System.exit(0);
        }

        return true;
    }

    /**
     * 检查任务序号是否合法。
     * 
     * @param n 任务序号。
     * @return true;
     */
    private boolean checkNum(int n) {
        if (n <= -1) {
            System.out.println(this.NUM_ERR);
            System.exit(0);
        }

        return true;
    }

    /**
     * 检查列表中是否存在对应序号的任务。
     * 
     * @param n    任务序号。
     * @param list 任务列表。
     * @return true
     */
    private boolean checkTaskExist(int n, ArrayList<Task> list) {
        if (n <= -1 || list == null || list.size() <= n) {
            System.out.println(this.TASK_NO_EXIST_ERR);
            System.exit(0);
        }

        return true;
    }

    /**
     * 检查移动步数是否合法。
     * 
     * @param n1
     * @return true
     */
    private boolean checkStep(int n1) {
        if (n1 <= -1) {
            System.out.println(this.STEP_ERR);
            System.exit(0);
        }

        return true;
    }
}